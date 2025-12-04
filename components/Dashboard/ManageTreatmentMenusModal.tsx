'use client'

import { useState, useEffect } from 'react'

interface TreatmentMenu {
  id: string
  name: string
  order: number
}

interface ManageTreatmentMenusModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function ManageTreatmentMenusModal({
  isOpen,
  onClose,
  onSave,
}: ManageTreatmentMenusModalProps) {
  const [menus, setMenus] = useState<TreatmentMenu[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [newMenuName, setNewMenuName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchMenus()
    }
  }, [isOpen])

  const fetchMenus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/treatment-menus')
      if (response.ok) {
        const data = await response.json()
        setMenus(data)
      } else {
        throw new Error('メニューの取得に失敗しました')
      }
    } catch (error) {
      console.error('Error fetching menus:', error)
      alert('メニューの取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartEdit = (menu: TreatmentMenu) => {
    setEditingId(menu.id)
    setEditName(menu.name)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleSaveEdit = async (menuId: string) => {
    if (!editName.trim()) {
      alert('メニュー名を入力してください')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/treatment-menus/${menuId}`, {
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

      await fetchMenus()
      setEditingId(null)
      setEditName('')
      alert('施術メニューを更新しました')
    } catch (error) {
      console.error('Error updating menu:', error)
      alert(error instanceof Error ? error.message : '更新に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (menuId: string) => {
    if (!confirm('この施術メニューを削除しますか？')) {
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/treatment-menus/${menuId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '削除に失敗しました')
      }

      await fetchMenus()
      alert('施術メニューを削除しました')
    } catch (error) {
      console.error('Error deleting menu:', error)
      alert(error instanceof Error ? error.message : '削除に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAdd = async () => {
    if (!newMenuName.trim()) {
      alert('メニュー名を入力してください')
      return
    }

    setIsAdding(true)
    try {
      const response = await fetch('/api/treatment-menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newMenuName.trim(),
          order: menus.length,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '追加に失敗しました')
      }

      await fetchMenus()
      setNewMenuName('')
      alert('施術メニューを追加しました')
    } catch (error) {
      console.error('Error adding menu:', error)
      alert(error instanceof Error ? error.message : '追加に失敗しました')
    } finally {
      setIsAdding(false)
    }
  }

  const handleClose = () => {
    setEditingId(null)
    setEditName('')
    setNewMenuName('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">施術メニュー管理</h2>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <>
            {/* 追加フォーム */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">新しい施術メニューを追加</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  placeholder="施術メニュー名を入力"
                  disabled={isAdding}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
                />
                <button
                  onClick={handleAdd}
                  disabled={isAdding || !newMenuName.trim()}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? '追加中...' : '追加'}
                </button>
              </div>
            </div>

            {/* メニュー一覧 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-3">施術メニュー一覧</h3>
              {menus.length === 0 ? (
                <p className="text-gray-500 text-center py-4">施術メニューがありません</p>
              ) : (
                menus.map((menu) => (
                  <div
                    key={menu.id}
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    {editingId === menu.id ? (
                      <>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          disabled={isSaving}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
                        />
                        <button
                          onClick={() => handleSaveEdit(menu.id)}
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
                        <span className="flex-1 text-gray-900">{menu.name}</span>
                        <button
                          onClick={() => handleStartEdit(menu)}
                          disabled={isSaving}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(menu.id)}
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

