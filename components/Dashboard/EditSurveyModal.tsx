'use client'

import { useState, useEffect } from 'react'

interface Clinic {
  id: string
  name: string
  doctors: {
    id: string
    name: string
  }[]
}

interface Survey {
  id: string
  clinic: { id: string; name: string }
  doctor: { id: string; name: string }
  treatmentDate: string
  treatmentMenu: string
  gender: string
  ageGroup: string
  satisfaction: string
}

interface EditSurveyModalProps {
  survey: Survey | null
  onClose: () => void
  onSave: () => void
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

const genders = ['男', '女']

const ageGroups = ['10代', '20代', '30代', '40代', '50代', '60代', '70代', '80代']

const satisfactions = ['大変満足', '満足', '普通', 'やや不満', '不満']

export default function EditSurveyModal({
  survey,
  onClose,
  onSave,
}: EditSurveyModalProps) {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [formData, setFormData] = useState<Partial<Survey>>({})
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (survey) {
      setFormData({
        clinicId: survey.clinic.id,
        doctorId: survey.doctor.id,
        treatmentDate: new Date(survey.treatmentDate).toISOString().split('T')[0],
        treatmentMenu: survey.treatmentMenu,
        gender: survey.gender,
        ageGroup: survey.ageGroup,
        satisfaction: survey.satisfaction,
      })
    }
  }, [survey])

  useEffect(() => {
    fetch('/api/clinics')
      .then((res) => res.json())
      .then((data) => {
        setClinics(data)
        if (survey && formData.clinicId) {
          const clinic = data.find((c: Clinic) => c.id === formData.clinicId)
          setSelectedClinic(clinic || null)
        }
      })
      .catch((error) => console.error('Error fetching clinics:', error))
  }, [survey, formData.clinicId])

  const handleClinicChange = (clinicId: string) => {
    const clinic = clinics.find((c) => c.id === clinicId)
    setSelectedClinic(clinic || null)
    setFormData({
      ...formData,
      clinicId,
      doctorId: '', // 院が変わったら先生をリセット
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!survey) return

    setIsSaving(true)

    try {
      const response = await fetch(`/api/dashboard/${survey.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '更新に失敗しました')
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error updating survey:', error)
      alert(error instanceof Error ? error.message : '更新に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  if (!survey) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">アンケート編集</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              院名
            </label>
            <select
              value={formData.clinicId || ''}
              onChange={(e) => handleClinicChange(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">選択してください</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              先生名
            </label>
            <select
              value={formData.doctorId || ''}
              onChange={(e) =>
                setFormData({ ...formData, doctorId: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">選択してください</option>
              {selectedClinic?.doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              施術日
            </label>
            <input
              type="date"
              value={formData.treatmentDate || ''}
              onChange={(e) =>
                setFormData({ ...formData, treatmentDate: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              施術メニュー
            </label>
            <select
              value={formData.treatmentMenu || ''}
              onChange={(e) =>
                setFormData({ ...formData, treatmentMenu: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">選択してください</option>
              {treatmentMenus.map((menu) => (
                <option key={menu} value={menu}>
                  {menu}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              性別
            </label>
            <select
              value={formData.gender || ''}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">選択してください</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              年齢層
            </label>
            <select
              value={formData.ageGroup || ''}
              onChange={(e) =>
                setFormData({ ...formData, ageGroup: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">選択してください</option>
              {ageGroups.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              満足度
            </label>
            <select
              value={formData.satisfaction || ''}
              onChange={(e) =>
                setFormData({ ...formData, satisfaction: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">選択してください</option>
              {satisfactions.map((satisfaction) => (
                <option key={satisfaction} value={satisfaction}>
                  {satisfaction}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

