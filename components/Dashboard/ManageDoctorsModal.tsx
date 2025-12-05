'use client'

import { useState, useEffect } from 'react'

interface Doctor {
  id: string
  name: string
  order: number
}

interface ClinicGroup {
  clinic: {
    id: string
    name: string
  }
  doctors: Doctor[]
}

interface ManageDoctorsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  embedded?: boolean
}

export default function ManageDoctorsModal({
  isOpen,
  onClose,
  onSave,
  embedded = false,
}: ManageDoctorsModalProps) {
  const [clinicGroups, setClinicGroups] = useState<ClinicGroup[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [selectedClinicId, setSelectedClinicId] = useState('')
  const [newDoctorName, setNewDoctorName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [draggedDoctorId, setDraggedDoctorId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchDoctors()
    }
  }, [isOpen])

  const fetchDoctors = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/doctors')
      if (response.ok) {
        const data = await response.json()
        setClinicGroups(data)
        if (data.length > 0 && !selectedClinicId) {
          setSelectedClinicId(data[0].clinic.id)
        }
      } else {
        throw new Error('先生の取得に失敗しました')
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
      alert('先生の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartEdit = (doctor: Doctor) => {
    setEditingId(doctor.id)
    setEditName(doctor.name)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleSaveEdit = async (doctorId: string) => {
    if (!editName.trim()) {
      alert('先生名を入力してください')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '更新に失敗しました')
      }

      await fetchDoctors()
      setEditingId(null)
      setEditName('')
      alert('先生名を更新しました')
      onSave()
    } catch (error) {
      console.error('Error updating doctor:', error)
      alert(error instanceof Error ? error.message : '更新に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (doctorId: string) => {
    if (!confirm('この先生を削除しますか？')) {
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/doctors/${doctorId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '削除に失敗しました')
      }

      await fetchDoctors()
      alert('先生を削除しました')
      onSave()
    } catch (error) {
      console.error('Error deleting doctor:', error)
      alert(error instanceof Error ? error.message : '削除に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAdd = async () => {
    if (!selectedClinicId || !newDoctorName.trim()) {
      alert('院と先生名を入力してください')
      return
    }

    setIsAdding(true)
    try {
      // 選択された院の現在の先生数を取得してorderを設定
      const selectedGroup = clinicGroups.find((g) => g.clinic.id === selectedClinicId)
      const nextOrder = selectedGroup ? selectedGroup.doctors.length : 0

      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinicId: selectedClinicId,
          name: newDoctorName.trim(),
          order: nextOrder,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '追加に失敗しました')
      }

      await fetchDoctors()
      setNewDoctorName('')
      alert('先生を追加しました')
      onSave()
    } catch (error) {
      console.error('Error adding doctor:', error)
      alert(error instanceof Error ? error.message : '追加に失敗しました')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, doctorId: string) => {
    setDraggedDoctorId(doctorId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (
    e: React.DragEvent,
    targetDoctorId: string,
    clinicId: string
  ) => {
    e.preventDefault()

    if (!draggedDoctorId || draggedDoctorId === targetDoctorId) {
      setDraggedDoctorId(null)
      return
    }

    // 同じ院の先生同士のみ入れ替え可能
    const clinicGroup = clinicGroups.find((g) => g.clinic.id === clinicId)
    if (!clinicGroup) return

    const draggedIndex = clinicGroup.doctors.findIndex((d) => d.id === draggedDoctorId)
    const targetIndex = clinicGroup.doctors.findIndex((d) => d.id === targetDoctorId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedDoctorId(null)
      return
    }

    // 順番を入れ替え
    const newDoctors = [...clinicGroup.doctors]
    const [dragged] = newDoctors.splice(draggedIndex, 1)
    newDoctors.splice(targetIndex, 0, dragged)

    // 順番を更新
    const doctorIds = newDoctors.map((d) => d.id)

    try {
      const response = await fetch('/api/doctors/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorIds }),
      })

      if (!response.ok) {
        throw new Error('順番の更新に失敗しました')
      }

      await fetchDoctors()
    } catch (error) {
      console.error('Error reordering doctors:', error)
      alert('順番の更新に失敗しました')
    }

    setDraggedDoctorId(null)
  }

  const handleClose = () => {
    setEditingId(null)
    setEditName('')
    setNewDoctorName('')
    setSelectedClinicId('')
    setDraggedDoctorId(null)
    onClose()
  }

  const selectedClinicGroup = clinicGroups.find((g) => g.clinic.id === selectedClinicId)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">先生名管理</h2>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <>
            {/* 追加フォーム */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">新しい先生を追加</h3>
              <div className="flex gap-2">
                <select
                  value={selectedClinicId}
                  onChange={(e) => setSelectedClinicId(e.target.value)}
                  disabled={isAdding}
                  className="px-4 py-2 border-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
                >
                  <option value="">院を選択</option>
                  {clinicGroups.map((group) => (
                    <option key={group.clinic.id} value={group.clinic.id}>
                      {group.clinic.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newDoctorName}
                  onChange={(e) => setNewDoctorName(e.target.value)}
                  placeholder="先生名を入力"
                  disabled={isAdding || !selectedClinicId}
                  className="flex-1 px-4 py-2 border-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
                />
                <button
                  onClick={handleAdd}
                  disabled={isAdding || !newDoctorName.trim() || !selectedClinicId}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? '追加中...' : '追加'}
                </button>
              </div>
            </div>

            {/* 院ごとの先生一覧 */}
            <div className="space-y-6">
              {clinicGroups.map((group) => (
                <div key={group.clinic.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{group.clinic.name}</h3>
                  {group.doctors.length === 0 ? (
                    <p className="text-gray-500 text-sm">先生が登録されていません</p>
                  ) : (
                    <div className="space-y-2">
                      {group.doctors.map((doctor, index) => (
                        <div
                          key={doctor.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, doctor.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, doctor.id, group.clinic.id)}
                          className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
                            draggedDoctorId === doctor.id
                              ? 'opacity-50 bg-gray-100'
                              : 'hover:bg-gray-50 border-gray-200 cursor-move'
                          }`}
                        >
                          <span className="text-gray-400 text-sm w-6">{index + 1}</span>
                          {editingId === doctor.id ? (
                            <>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                disabled={isSaving}
                                className="flex-1 px-3 py-2 border-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
                              />
                              <button
                                onClick={() => handleSaveEdit(doctor.id)}
                                disabled={isSaving || !editName.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              >
                                {isSaving ? '保存中...' : '保存'}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              >
                                キャンセル
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="flex-1 text-gray-900">{doctor.name}</span>
                              <button
                                onClick={() => handleStartEdit(doctor)}
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              >
                                編集
                              </button>
                              <button
                                onClick={() => handleDelete(doctor.id)}
                                disabled={isSaving}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              >
                                削除
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        
    </div>
  )
}

