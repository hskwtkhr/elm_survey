'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Clinic {
  id: string
  name: string
  google_review_url: string
  doctors: {
    id: string
    name: string
  }[]
}

interface SurveyFormData {
  clinicId: string
  doctorId: string
  treatmentDate: string
  treatmentMenu: string
  gender: string
  ageGroup: string
  resultSatisfaction?: string
  counselingSatisfaction?: string
  atmosphereRating?: string
  staffServiceRating?: string
  message?: string // 伝えたいこと（任意）
}

const treatmentMenus = [
  'ボトックス注射',
  'ヒアルロン酸注射',
  '糸リフト',
  'アートメイク',
  'フォトフェイシャル',
  'ポテンツァ',
  'その他',
]

const genders = ['男性', '女性']

const ageGroups = ['10代', '20代', '30代', '40代', '50代', '60代', '70代', '80代']

const satisfactions = ['大変満足', '満足', '普通', 'やや不満', '不満']
const resultSatisfactions = ['大変満足', '満足', '普通', 'やや不満', '不満']
const counselingSatisfactions = ['とても満足', '満足', '普通', 'やや不満', '不満']
const atmosphereRatings = ['とても良い', '良い', '普通', 'やや悪い', '悪い']
const staffServiceRatings = ['とても丁寧だった', '丁寧だった', '普通', 'やや不満', '不満']

export default function SurveyForm() {
  const router = useRouter()
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<SurveyFormData>>({
    treatmentDate: new Date().toISOString().split('T')[0], // デフォルトで今日の日付
  })
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/clinics')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch clinics')
        }
        return res.json()
      })
      .then((data) => {
        // データが配列であることを確認
        if (Array.isArray(data)) {
          // IDで重複を削除（念のため）
          const uniqueClinics = Array.from(
            new Map(data.map((clinic: Clinic) => [clinic.id, clinic])).values()
          )
          setClinics(uniqueClinics)
        } else {
          console.error('Invalid clinics data:', data)
          setClinics([])
        }
      })
      .catch((error) => {
        console.error('Error fetching clinics:', error)
        setClinics([])
      })
  }, [])

  const handleSelect = (field: keyof SurveyFormData, value: string, autoAdvance: boolean = true) => {
    const newData = { ...formData, [field]: value }

    if (field === 'clinicId') {
      const clinic = clinics.find((c) => c.id === value)
      setSelectedClinic(clinic || null)
      newData.doctorId = '' // 院が変わったら先生をリセット
    }

    setFormData(newData)
    // ステップ1（性別・年齢層）では自動で進まない
    if (autoAdvance && !(currentStep === 1 && (field === 'gender' || field === 'ageGroup'))) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmitWithData = async (dataToSubmit: Partial<SurveyFormData>) => {
    // すべての必須フィールドをチェック
    if (
      !dataToSubmit.clinicId ||
      !dataToSubmit.doctorId ||
      !dataToSubmit.treatmentDate ||
      !dataToSubmit.treatmentMenu ||
      !dataToSubmit.gender ||
      !dataToSubmit.ageGroup
    ) {
      console.error('Missing fields:', {
        clinicId: !!dataToSubmit.clinicId,
        doctorId: !!dataToSubmit.doctorId,
        treatmentDate: !!dataToSubmit.treatmentDate,
        treatmentMenu: !!dataToSubmit.treatmentMenu,
        gender: !!dataToSubmit.gender,
        ageGroup: !!dataToSubmit.ageGroup,
      })
      alert('すべての項目を入力してください')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('Submitting survey data:', dataToSubmit)
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'アンケートの送信に失敗しました'
        throw new Error(errorMessage)
      }

      const result = await response.json()

      // 判定条件：
      // 1. 施術への満足度が「大変満足」または「満足」
      // 2. カウンセリングに「不満」が無い（「やや不満」はOK）
      // 3. 院内の雰囲気に「悪い」が無い（「やや悪い」はOK）
      // 4. スタッフの対応に「不満」が無い（「やや不満」はOK）
      const isResultSatisfied = result.resultSatisfaction === '大変満足' || result.resultSatisfaction === '満足'
      const hasNoCounselingDissatisfaction = !result.counselingSatisfaction || result.counselingSatisfaction !== '不満'
      const hasNoAtmosphereDissatisfaction = !result.atmosphereRating || result.atmosphereRating !== '悪い'
      const hasNoStaffDissatisfaction = !result.staffServiceRating || result.staffServiceRating !== '不満'

      if (isResultSatisfied && hasNoCounselingDissatisfaction && hasNoAtmosphereDissatisfaction && hasNoStaffDissatisfaction) {
        router.push(`/review/${result.clinicId}?surveyId=${result.id}`)
      } else {
        // それ以外は完了ページへ
        router.push('/complete')
      }
    } catch (error) {
      console.error('Error submitting survey:', error)
      const errorMessage = error instanceof Error ? error.message : 'アンケートの送信に失敗しました。もう一度お試しください。'
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    await handleSubmitWithData(formData)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // 性別と年齢層（同時表示）
        return (
          <div className="space-y-4 md:space-y-8">
            <div className="space-y-2 md:space-y-4">
              <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-black">性別を選択してください</h2>
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                {genders.map((gender) => (
                  <button
                    key={gender}
                    onClick={() => handleSelect('gender', gender, false)}
                    className={`p-3 md:p-4 border-2 rounded-lg transition-colors text-black font-medium text-sm md:text-base ${
                      formData.gender === gender
                        ? 'border-pink-500 bg-pink-300'
                        : 'border-pink-200 md:hover:border-pink-400 md:hover:bg-pink-200'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 md:space-y-4">
              <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-black">年齢層を選択してください</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {ageGroups.map((age) => (
                  <button
                    key={age}
                    onClick={() => handleSelect('ageGroup', age, false)}
                    className={`p-3 md:p-4 border-2 rounded-lg transition-colors text-black font-medium text-sm md:text-base ${
                      formData.ageGroup === age
                        ? 'border-pink-500 bg-pink-300'
                        : 'border-pink-200 md:hover:border-pink-400 md:hover:bg-pink-200'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
            {formData.gender && formData.ageGroup && (
              <div className="mt-4 md:mt-6">
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="w-full px-4 py-2 md:px-6 md:py-3 bg-pink-300 text-black rounded-lg hover:bg-pink-400 transition-colors font-medium text-sm md:text-base"
                >
                  次へ
                </button>
              </div>
            )}
          </div>
        )

      case 2:
        // 院
        return (
          <div className="space-y-4">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-black">どちらの院で施術を受けられましたか？</h2>
            {clinics.length === 0 ? (
              <p className="text-black">院情報を読み込み中...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                {clinics.map((clinic) => (
                <button
                  key={clinic.id}
                  onClick={() => handleSelect('clinicId', clinic.id)}
                  className={`p-3 md:p-4 border-2 rounded-lg transition-colors text-left text-black font-medium text-sm md:text-base ${
                    formData.clinicId === clinic.id
                      ? 'border-pink-500 bg-pink-300'
                      : 'border-pink-200 md:hover:border-pink-400 md:hover:bg-pink-200'
                  }`}
                >
                  {clinic.name}
                </button>
                ))}
              </div>
            )}
          </div>
        )

      case 3:
        // 先生
        return (
          <div className="space-y-4">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-black">どちらの先生に施術していただきましたか？</h2>
            {selectedClinic ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                {selectedClinic.doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => handleSelect('doctorId', doctor.id)}
                    className={`p-3 md:p-4 border-2 rounded-lg transition-colors text-left text-black font-medium text-sm md:text-base ${
                      formData.doctorId === doctor.id
                        ? 'border-pink-500 bg-pink-300'
                        : 'border-pink-200 md:hover:border-pink-400 md:hover:bg-pink-200'
                    }`}
                  >
                    {doctor.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-black">院を選択してください</p>
            )}
          </div>
        )

      case 4:
        // 施術日
        return (
          <div className="space-y-4">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-black">施術日を選択してください</h2>
            <input
              type="date"
              value={formData.treatmentDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setFormData({ ...formData, treatmentDate: e.target.value })
              }}
              onClick={(e) => {
                // クリックでカレンダーを表示（スマホでは自動的にカレンダーが表示される）
                if (e.currentTarget.showPicker) {
                  e.currentTarget.showPicker()
                }
              }}
              onDoubleClick={(e) => {
                // ダブルクリックでテキスト入力モードに（PCのみ）
                e.currentTarget.focus()
                e.currentTarget.select()
              }}
              max={new Date().toISOString().split('T')[0]}
              className="w-full box-border p-3 md:p-4 border-2 border-pink-200 rounded-lg text-sm md:text-lg text-black md:hover:border-pink-400 focus:border-pink-400 focus:outline-none"
              style={{ boxSizing: 'border-box' }}
            />
            <div className="mt-4">
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!formData.treatmentDate}
                className="px-4 py-2 md:px-6 md:py-3 bg-pink-300 text-black rounded-lg hover:bg-pink-400 transition-colors font-medium text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                次へ
              </button>
            </div>
          </div>
        )

      case 5:
        // 施術メニュー
        return (
          <div className="space-y-4">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-black">どの施術メニューを受けられましたか？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              {treatmentMenus.map((menu) => (
                <button
                  key={menu}
                  onClick={() => handleSelect('treatmentMenu', menu)}
                  className={`p-3 md:p-4 border-2 rounded-lg transition-colors text-left text-black font-medium text-sm md:text-base ${
                    formData.treatmentMenu === menu
                      ? 'border-pink-500 bg-pink-300'
                      : 'border-pink-200 md:hover:border-pink-400 md:hover:bg-pink-200'
                  }`}
                >
                  {menu}
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        // 結果への満足度
        return (
          <div className="space-y-4">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-black">施術結果に満足できましたか？</h2>
            <div className="grid grid-cols-1 gap-2 md:gap-4">
              {resultSatisfactions.map((result) => (
                <button
                  key={result}
                  onClick={() => handleSelect('resultSatisfaction', result)}
                  className={`p-3 md:p-4 border-2 rounded-lg transition-colors text-left text-black font-medium text-sm md:text-base ${
                    formData.resultSatisfaction === result
                      ? 'border-pink-500 bg-pink-300'
                      : 'border-pink-200 md:hover:border-pink-400 md:hover:bg-pink-200'
                  }`}
                >
                  {result}
                </button>
              ))}
            </div>
          </div>
        )

      case 7:
        // カウンセリングへの満足度
        return (
          <div className="space-y-4">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-black">カウンセリングはご希望に沿った内容でしたか？</h2>
            <div className="grid grid-cols-1 gap-2 md:gap-4">
              {counselingSatisfactions.map((counseling) => (
                <button
                  key={counseling}
                  onClick={() => handleSelect('counselingSatisfaction', counseling)}
                  className={`p-3 md:p-4 border-2 rounded-lg transition-colors text-left text-black font-medium text-sm md:text-base ${
                    formData.counselingSatisfaction === counseling
                      ? 'border-pink-500 bg-pink-300'
                      : 'border-pink-200 md:hover:border-pink-400 md:hover:bg-pink-200'
                  }`}
                >
                  {counseling}
                </button>
              ))}
            </div>
          </div>
        )

      case 8:
        // 院内の雰囲気
        return (
          <div className="space-y-4">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-black">院内の雰囲気はいかがでしたか？</h2>
            <div className="grid grid-cols-1 gap-2 md:gap-4">
              {atmosphereRatings.map((atmosphere) => (
                <button
                  key={atmosphere}
                  onClick={() => handleSelect('atmosphereRating', atmosphere)}
                  className={`p-3 md:p-4 border-2 rounded-lg transition-colors text-left text-black font-medium text-sm md:text-base ${
                    formData.atmosphereRating === atmosphere
                      ? 'border-pink-500 bg-pink-300'
                      : 'border-pink-200 md:hover:border-pink-400 md:hover:bg-pink-200'
                  }`}
                >
                  {atmosphere}
                </button>
              ))}
            </div>
          </div>
        )

      case 9:
        // スタッフの対応
        return (
          <div className="space-y-4">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-black">スタッフの対応はいかがでしたか？</h2>
            <div className="grid grid-cols-1 gap-2 md:gap-4">
              {staffServiceRatings.map((staff) => (
                <button
                  key={staff}
                  onClick={() => handleSelect('staffServiceRating', staff)}
                  className={`p-3 md:p-4 border-2 rounded-lg transition-colors text-left text-black font-medium text-sm md:text-base ${
                    formData.staffServiceRating === staff
                      ? 'border-pink-500 bg-pink-300'
                      : 'border-pink-200 md:hover:border-pink-400 md:hover:bg-pink-200'
                  }`}
                >
                  {staff}
                </button>
              ))}
            </div>
          </div>
        )

      case 10:
        // 伝えたいこと
        const selectedClinicName = clinics.find(c => c.id === formData.clinicId)?.name || ''
        const selectedDoctorName = selectedClinic?.doctors.find(d => d.id === formData.doctorId)?.name || ''
        
        return (
          <div className="space-y-4">
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-black">伝えたいことがあれば、お書きください（任意）</h2>
            <textarea
              value={formData.message || ''}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value })
              }}
              placeholder="ご意見やご感想をお聞かせください"
              rows={6}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg text-black resize-none"
            />
            
            {/* 選択内容の確認 */}
            <div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-pink-200">
              <h3 className="text-xl font-bold mb-4 text-black">ご回答内容の確認</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-base text-black">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium bg-white w-40">性別</td>
                      <td className="px-4 py-3 bg-white">{formData.gender || '未選択'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium bg-gray-50 w-40">年齢層</td>
                      <td className="px-4 py-3 bg-gray-50">{formData.ageGroup || '未選択'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium bg-white w-40">院名</td>
                      <td className="px-4 py-3 bg-white">{selectedClinicName || '未選択'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium bg-gray-50 w-40">先生名</td>
                      <td className="px-4 py-3 bg-gray-50">{selectedDoctorName || '未選択'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium bg-white w-40">施術日</td>
                      <td className="px-4 py-3 bg-white">{formData.treatmentDate ? new Date(formData.treatmentDate).toLocaleDateString('ja-JP') : '未選択'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium bg-gray-50 w-40">施術メニュー</td>
                      <td className="px-4 py-3 bg-gray-50">{formData.treatmentMenu || '未選択'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium bg-white w-40">結果への満足度</td>
                      <td className="px-4 py-3 bg-white">{formData.resultSatisfaction || '未選択'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium bg-gray-50 w-40">カウンセリング</td>
                      <td className="px-4 py-3 bg-gray-50">{formData.counselingSatisfaction || '未選択'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium bg-white w-40">院内の雰囲気</td>
                      <td className="px-4 py-3 bg-white">{formData.atmosphereRating || '未選択'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium bg-gray-50 w-40">スタッフの対応</td>
                      <td className="px-4 py-3 bg-gray-50">{formData.staffServiceRating || '未選択'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-pink-100 hover:border-pink-300 border-2 border-transparent transition-colors font-medium"
              >
                戻る
              </button>
              <button
                onClick={async () => {
                  await handleSubmitWithData(formData)
                }}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-pink-300 text-black rounded-lg hover:bg-pink-400 transition-colors font-medium text-sm md:text-base disabled:opacity-50"
              >
                {isSubmitting ? '送信中...' : '送信する'}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ELM CLINIC ロゴ */}
        <div className="text-center mb-4 md:mb-8">
          <img 
            src="/elm_logo.png" 
            alt="ELM CLINIC" 
            className="mx-auto mb-2 md:mb-4 max-w-xs md:max-w-md"
            style={{ maxHeight: '120px', objectFit: 'contain' }}
          />
          <p className="text-sm md:text-lg text-black leading-relaxed px-2 md:px-0" style={{ fontFamily: 'var(--font-noto-sans-jp), sans-serif' }}>
            ご来院ありがとうございました。
            <br />
            ぜひアンケートにご協力ください。
          </p>
        </div>

        {/* アンケートフォーム */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
          <div className="mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs md:text-sm text-black font-medium">質問 {currentStep} / 10</span>
              <div className="w-32 md:w-64 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-pink-300 h-2 rounded-full transition-all"
                  style={{ width: `${(currentStep / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

        {renderStep()}

          {currentStep > 1 && currentStep < 10 && (
            <div className="mt-4 md:mt-8">
              <button
                onClick={handleBack}
                className="px-4 py-2 md:px-6 md:py-2 bg-gray-200 text-black rounded-lg hover:bg-pink-100 hover:border-pink-300 border-2 border-transparent transition-colors font-medium text-sm md:text-base"
              >
                戻る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

