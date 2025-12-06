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
  embedded?: boolean
}

export default function ManageTreatmentMenusModal({
  isOpen,
  onClose,
  onSave,
  embedded = false,
}: ManageTreatmentMenusModalProps) {
  const [menus, setMenus] = useState<TreatmentMenu[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [newMenuName, setNewMenuName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [draggedMenuId, setDraggedMenuId] = useState<string | null>(null)

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

  const handleDragStart = (e: React.DragEvent, menuId: string) => {
    setDraggedMenuId(menuId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetMenuId: string) => {
    e.preventDefault()

    if (!draggedMenuId || draggedMenuId === targetMenuId) {
      setDraggedMenuId(null)
      return
    }

    const draggedIndex = menus.findIndex((m) => m.id === draggedMenuId)
    const targetIndex = menus.findIndex((m) => m.id === targetMenuId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedMenuId(null)
      return
    }

    // 順番を入れ替え
    const newMenus = [...menus]
    const [dragged] = newMenus.splice(draggedIndex, 1)
    newMenus.splice(targetIndex, 0, dragged)

    // 順番を更新
    const menuIds = newMenus.map((m) => m.id)

    try {
      const response = await fetch('/api/treatment-menus/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuIds }),
      })

      if (!response.ok) {
        throw new Error('順番の更新に失敗しました')
      }

      await fetchMenus()
    } catch (error) {
      console.error('Error reordering menus:', error)
      alert('順番の更新に失敗しました')
    }

    setDraggedMenuId(null)
  }

  const handleClose = () => {
    setEditingId(null)
    setEditName('')
    setNewMenuName('')
    setDraggedMenuId(null)
    onClose()
  }

  if (!isOpen) return null

  const content = (
    <div
      className={embedded ? "" : "bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"}
      onClick={(e) => e.stopPropagation()}
    >

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      ) : (
        <>
          {/* 追加フォーム */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">新しい施術メニューを追加</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                placeholder="施術メニュー名を入力"
                disabled={isAdding}
                className="flex-1 px-4 py-2 border-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
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
            <h3 className="text-lg font-semibold mb-3 text-gray-900">施術メニュー一覧</h3>
            {menus.length === 0 ? (
              <p className="text-gray-500 text-center py-4">施術メニューがありません</p>
            ) : (
              menus.map((menu, index) => (
                <div
                  key={menu.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, menu.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, menu.id)}
                  className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${draggedMenuId === menu.id
                    ? 'opacity-50 bg-gray-100'
                    : 'hover:bg-gray-50 border-gray-200 cursor-move'
                    }`}
                >
                  {editingId === menu.id ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={isSaving}
                        className="flex-1 px-3 py-2 border-0 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
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
                      <span className="text-gray-400 text-sm w-6">{index + 1}</span>
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
                  }
                </div>
              ))
            )}
          </div>
        </>
      )}


    </div>
  )

  if (embedded) {
    return content
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      {content}
    </div>
  )
}

