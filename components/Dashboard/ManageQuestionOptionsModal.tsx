'use client'

import { useState, useEffect } from 'react'

interface QuestionOption {
  id: string
  label: string
  value: string
  order: number
}

interface QuestionOptionsByCategory {
  [category: string]: QuestionOption[]
}

const categoryLabels: Record<string, string> = {
  gender: '性別',
  ageGroup: '年齢層',
  satisfaction: '満足度',
  resultSatisfaction: '結果への満足度',
  counselingSatisfaction: 'カウンセリングへの満足度',
  atmosphereRating: '院内の雰囲気',
  staffServiceRating: 'スタッフの対応',
}

interface ManageQuestionOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  embedded?: boolean
}

export default function ManageQuestionOptionsModal({
  isOpen,
  onClose,
  onSave,
  embedded = false,
}: ManageQuestionOptionsModalProps) {
  const [optionsByCategory, setOptionsByCategory] = useState<QuestionOptionsByCategory>({})
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('gender')
  const [newValue, setNewValue] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [draggedOptionId, setDraggedOptionId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchOptions()
    }
  }, [isOpen])

  const fetchOptions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/question-options')
      if (response.ok) {
        const data = await response.json()
        setOptionsByCategory(data)
      } else {
        throw new Error('選択肢の取得に失敗しました')
      }
    } catch (error) {
      console.error('Error fetching options:', error)
      alert('選択肢の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartEdit = (option: QuestionOption) => {
    setEditingId(option.id)
    setEditValue(option.value)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const handleSaveEdit = async (optionId: string) => {
    if (!editValue.trim()) {
      alert('値を入力してください')
      return
    }

    setIsSaving(true)
    try {
      const trimmedValue = editValue.trim();
      const response = await fetch(`/api/question-options/${optionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: trimmedValue,
          value: trimmedValue,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '更新に失敗しました')
      }

      await fetchOptions()
      setEditingId(null)      setEditValue('')
      alert('選択肢を更新しました')
      onSave()
    } catch (error) {
      console.error('Error updating option:', error)
      alert(error instanceof Error ? error.message : '更新に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (optionId: string) => {
    if (!confirm('この選択肢を削除しますか？')) {
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/question-options/${optionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '削除に失敗しました')
      }

      await fetchOptions()
      alert('選択肢を削除しました')
      onSave()
    } catch (error) {
      console.error('Error deleting option:', error)
      alert(error instanceof Error ? error.message : '削除に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAdd = async () => {
    if (!newValue.trim()) {
      alert('値を入力してください')
      return
    }

    setIsAdding(true)
    try {
      const currentOptions = optionsByCategory[selectedCategory] || []
      const trimmedValue = newValue.trim();
      const response = await fetch('/api/question-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          label: trimmedValue,
          value: trimmedValue,
          order: currentOptions.length,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '追加に失敗しました')
      }

      await fetchOptions()      setNewValue('')
      alert('選択肢を追加しました')
      onSave()
    } catch (error) {
      console.error('Error adding option:', error)
      alert(error instanceof Error ? error.message : '追加に失敗しました')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, optionId: string) => {
    setDraggedOptionId(optionId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetOptionId: string, category: string) => {
    e.preventDefault()

    if (!draggedOptionId || draggedOptionId === targetOptionId) {
      setDraggedOptionId(null)
      return
    }

    const options = optionsByCategory[category] || []
    const draggedIndex = options.findIndex((o) => o.id === draggedOptionId)
    const targetIndex = options.findIndex((o) => o.id === targetOptionId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedOptionId(null)
      return
    }

    // 順番を入れ替え
    const newOptions = [...options]
    const [dragged] = newOptions.splice(draggedIndex, 1)
    newOptions.splice(targetIndex, 0, dragged)

    // 順番を更新
    const optionIds = newOptions.map((o) => o.id)

    try {
      const response = await fetch('/api/question-options/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionIds, category }),
      })

      if (!response.ok) {
        throw new Error('順番の更新に失敗しました')
      }

      await fetchOptions()
    } catch (error) {
      console.error('Error reordering options:', error)
      alert('順番の更新に失敗しました')
    }

    setDraggedOptionId(null)
  }

  const handleClose = () => {
    setEditingId(null)
    setEditValue('')    setNewValue('')
    setSelectedCategory('gender')
    setDraggedOptionId(null)
    onClose()
  }

  if (!isOpen) return null

  const categories = Object.keys(categoryLabels)
  const currentOptions = optionsByCategory[selectedCategory] || []

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">設問選択肢の管理</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <>
            {/* カテゴリ選択 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                設問カテゴリを選択
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
            </div>

            {/* 追加フォーム */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                {categoryLabels[selectedCategory]}の選択肢を追加
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="選択肢(例: 男性)"
                  disabled={isAdding}
                  className="flex-1 px-4 py-2 border-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
                />
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  disabled={isAdding}
                  className="flex-1 px-4 py-2 border-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
                />
                <button
                  onClick={handleAdd}
                  disabled={isAdding || !newValue.trim()}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? '追加中...' : '追加'}
                </button>
              </div>
            </div>

            {/* 選択肢一覧 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                {categoryLabels[selectedCategory]}の選択肢一覧
              </h3>
              {currentOptions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">選択肢がありません</p>
              ) : (
                currentOptions.map((option, index) => (
                  <div
                    key={option.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, option.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, option.id, selectedCategory)}
                    className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
                      draggedOptionId === option.id
                        ? 'opacity-50 bg-gray-100'
                        : 'hover:bg-gray-50 border-gray-200 cursor-move'
                    }`}
                  >
                    <span className="text-gray-400 text-sm w-6">{index + 1}</span>
                    {editingId === option.id ? (
                      <>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          disabled={isSaving}
                          placeholder="選択肢"
                          className="flex-1 px-3 py-2 border-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
                        />
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          disabled={isSaving}
                          className="flex-1 px-3 py-2 border-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
                        />
                        <button
                          onClick={() => handleSaveEdit(option.id)}
                          disabled={isSaving || !editValue.trim()}
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
                        <span className="flex-1 text-gray-900">{option.label}</span>
                        <span className="text-sm text-gray-500">({option.value})</span>
                        <button
                          onClick={() => handleStartEdit(option)}
                          disabled={isSaving}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(option.id)}
                          disabled={isSaving}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        <div className="flex gap-4 pt-6 mt-6 border-t">
          <button
            onClick={handleClose}
            disabled={isSaving || isAdding}
            className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}


