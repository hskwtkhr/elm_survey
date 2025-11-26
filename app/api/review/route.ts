import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateReviewText } from '@/lib/google-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { surveyId } = body

    if (!surveyId) {
      return NextResponse.json(
        { error: 'surveyId is required' },
        { status: 400 }
      )
    }

    // アンケートデータを取得
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        clinic: {
          select: {
            name: true,
            google_review_url: true,
          },
        },
        doctor: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!survey) {
      return NextResponse.json(
        { error: 'アンケートが見つかりません' },
        { status: 404 }
      )
    }

    // 結果への満足度を取得（カラムが追加されるまでの暫定対応）
    const resultSatisfaction = (survey as any).resultSatisfaction || survey.satisfaction
    const counselingSatisfaction = (survey as any).counselingSatisfaction || null
    const atmosphereRating = (survey as any).atmosphereRating || null
    const staffServiceRating = (survey as any).staffServiceRating || null

    // 判定条件：
    // 1. 施術への満足度が「大変満足」または「満足」
    // 2. カウンセリングに「不満」が無い（「やや不満」はOK）
    // 3. 院内の雰囲気に「悪い」が無い（「やや悪い」はOK）
    // 4. スタッフの対応に「不満」が無い（「やや不満」はOK）
    const isResultSatisfied = resultSatisfaction === '大変満足' || resultSatisfaction === '満足'
    const hasNoCounselingDissatisfaction = !counselingSatisfaction || counselingSatisfaction !== '不満'
    const hasNoAtmosphereDissatisfaction = !atmosphereRating || atmosphereRating !== '悪い'
    const hasNoStaffDissatisfaction = !staffServiceRating || staffServiceRating !== '不満'

    if (!isResultSatisfied || !hasNoCounselingDissatisfaction || !hasNoAtmosphereDissatisfaction || !hasNoStaffDissatisfaction) {
      return NextResponse.json(
        { error: '口コミは、施術への満足度が「大変満足」または「満足」で、カウンセリング・院内の雰囲気・スタッフの対応に「不満」「悪い」がない場合のみ生成できます' },
        { status: 400 }
      )
    }

    // AIで口コミ文を生成（すべての満足度情報を渡す）
    const reviewText = await generateReviewText({
      clinicName: survey.clinic.name,
      doctorName: survey.doctor.name,
      treatmentMenu: survey.treatmentMenu,
      resultSatisfaction: resultSatisfaction,
      counselingSatisfaction: counselingSatisfaction,
      atmosphereRating: atmosphereRating,
      staffServiceRating: staffServiceRating,
      message: (survey as any).message || null,
    })

    return NextResponse.json({
      reviewText,
      clinicId: survey.clinicId,
      googleReviewUrl: survey.clinic.google_review_url,
    })
  } catch (error) {
    console.error('Error generating review:', error)
    const errorMessage = error instanceof Error ? error.message : '口コミ文の生成に失敗しました'
    console.error('Error details:', errorMessage)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

