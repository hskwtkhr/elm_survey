import { GoogleGenerativeAI } from '@google/generative-ai'

export async function generateReviewText(surveyData: {
  clinicName: string
  doctorName: string
  treatmentMenu: string
  resultSatisfaction: string
  counselingSatisfaction?: string | null
  atmosphereRating?: string | null
  staffServiceRating?: string | null
  message?: string | null
}): Promise<string> {
  let apiKey = process.env.GOOGLE_AI_API_KEY

  if (!apiKey) {
    throw new Error('GOOGLE_AI_API_KEY is not set')
  }

  // 引用符を除去（.envファイルで引用符で囲まれている場合）
  apiKey = apiKey.replace(/^["']|["']$/g, '').trim()

  const genAI = new GoogleGenerativeAI(apiKey)
  // Google Generative AIの最新モデル名を使用
  // 利用可能なモデル: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash
  // models/プレフィックスは不要（SDKが自動的に追加）
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  // 満足度情報を自然な日本語に変換
  const satisfactionTexts: string[] = []
  
  if (surveyData.resultSatisfaction) {
    satisfactionTexts.push(`施術結果への満足度: ${surveyData.resultSatisfaction}`)
  }
  if (surveyData.counselingSatisfaction) {
    satisfactionTexts.push(`カウンセリング: ${surveyData.counselingSatisfaction}`)
  }
  if (surveyData.atmosphereRating) {
    satisfactionTexts.push(`院内の雰囲気: ${surveyData.atmosphereRating}`)
  }
  if (surveyData.staffServiceRating) {
    satisfactionTexts.push(`スタッフの対応: ${surveyData.staffServiceRating}`)
  }

  const prompt = `以下のアンケート結果を基に、Googleマップの口コミとして自然で適切な文章を生成してください。
口コミは日本語で、100文字から200文字程度でお願いします。
個人名や具体的な施術内容の詳細は含めず、一般的な表現でお願いします。
満足度の情報を自然に反映させてください。

院名: ${surveyData.clinicName}
先生名: ${surveyData.doctorName}
施術メニュー: ${surveyData.treatmentMenu}
${satisfactionTexts.join('\n')}
${surveyData.message ? `その他のコメント: ${surveyData.message}` : ''}

口コミ文を生成してください:`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text.trim()
  } catch (error) {
    console.error('Error generating review text:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', errorMessage)
    
    // モデルが見つからない場合、別のモデルを試す
    if (errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('is not found')) {
      // 利用可能なモデルを順に試す
      const alternativeModels = ['gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
      
      for (const altModelName of alternativeModels) {
        try {
          console.log(`${altModelName}を試します...`)
          const altModel = genAI.getGenerativeModel({ model: altModelName })
          const result = await altModel.generateContent(prompt)
          const response = await result.response
          const text = response.text()
          console.log(`${altModelName}で成功しました`)
          return text.trim()
        } catch (altError) {
          console.error(`${altModelName}も失敗しました:`, altError)
          // 最後のモデルでない場合は続行
          if (altModelName !== alternativeModels[alternativeModels.length - 1]) {
            continue
          }
          // 最後のモデルも失敗した場合
          const fallbackErrorMessage = altError instanceof Error ? altError.message : 'Unknown error'
          throw new Error(`利用可能なモデルが見つかりません。エラー: ${fallbackErrorMessage}。Google Cloud ConsoleでGenerative Language APIが有効になっているか、APIキーが正しいか確認してください。`)
        }
      }
    }
    
    // APIキーが設定されていない場合のエラーメッセージ
    if (errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
      throw new Error('Google AI APIキーが無効です。Google Cloud ConsoleでAPIキーが正しく設定されているか、Generative Language APIが有効になっているか確認してください。')
    }
    
    // その他のエラー
    throw new Error(`口コミ文の生成に失敗しました: ${errorMessage}`)
  }
}

