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

interface EditDoctorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function EditDoctorModal({
  isOpen,
  onClose,
  onSave,
}: EditDoctorModalProps) {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [selectedClinicId, setSelectedClinicId] = useState('')
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [newName, setNewName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchClinics()
    }
  }, [isOpen])

  const fetchClinics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/clinics')
      const data = await response.json()
      setClinics(data)
    } catch (error) {
      console.error('Error fetching clinics:', error)
      alert('院の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClinicChange = (clinicId: string) => {
    setSelectedClinicId(clinicId)
    setSelectedDoctorId('')
    setNewName('')
  }

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctorId(doctorId)
    const clinic = clinics.find((c) => c.id === selectedClinicId)
    const doctor = clinic?.doctors.find((d) => d.id === doctorId)
    setNewName(doctor?.name || '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDoctorId || !newName.trim()) {
      alert('すべての項目を入力してください')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/doctors/${selectedDoctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '更新に失敗しました')
      }

      alert('先生名を更新しました')
      onSave()
      handleClose()
    } catch (error) {
      console.error('Error updating doctor:', error)
      alert(error instanceof Error ? error.message : '更新に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    setSelectedClinicId('')
    setSelectedDoctorId('')
    setNewName('')
    onClose()
  }

  if (!isOpen) return null

  const selectedClinic = clinics.find((c) => c.id === selectedClinicId)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">先生名の変更</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              院名
            </label>
            <select
              value={selectedClinicId}
              onChange={(e) => handleClinicChange(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
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
              変更する先生
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => handleDoctorChange(e.target.value)}
              required
              disabled={!selectedClinicId || isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
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
              新しい先生名
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              disabled={!selectedDoctorId || isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
              placeholder="先生名を入力"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSaving || isLoading}
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

