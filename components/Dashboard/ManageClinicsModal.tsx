
'use client'

import { useState, useEffect } from 'react'

interface Clinic {
    id: string
    name: string
    google_review_url: string | null
}

interface ManageClinicsModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
}

export default function ManageClinicsModal({
    isOpen,
    onClose,
    onSave,
}: ManageClinicsModalProps) {
    const [clinics, setClinics] = useState<Clinic[]>([])
    const [editingClinic, setEditingClinic] = useState<Clinic | null>(null)
    const [newClinicName, setNewClinicName] = useState('')
    const [newClinicUrl, setNewClinicUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            fetchClinics()
        }
    }, [isOpen])

    const fetchClinics = async () => {
        try {
            const res = await fetch('/api/clinics')
            if (!res.ok) throw new Error('Failed to fetch clinics')
            const data = await res.json()
            setClinics(data)
        } catch (err) {
            console.error(err)
            setError('院一覧の取得に失敗しました')
        }
    }

    const handleAddClinic = async () => {
        if (!newClinicName.trim()) return

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/clinics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newClinicName,
                    google_review_url: newClinicUrl,
                }),
            })

            if (!res.ok) throw new Error('Failed to add clinic')

            setNewClinicName('')
            setNewClinicUrl('')
            fetchClinics()
            onSave()
        } catch (err) {
            console.error(err)
            setError('院の追加に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateClinic = async () => {
        if (!editingClinic || !editingClinic.name.trim()) return

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/clinics', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingClinic.id,
                    name: editingClinic.name,
                    google_review_url: editingClinic.google_review_url,
                }),
            })

            if (!res.ok) throw new Error('Failed to update clinic')

            setEditingClinic(null)
            fetchClinics()
            onSave()
        } catch (err) {
            console.error(err)
            setError('院の更新に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteClinic = async (id: string) => {
        if (!window.confirm('本当に削除しますか？\n医師情報やアンケートデータがある場合は削除できません。')) return

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch(`/api/clinics?id=${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Failed to delete clinic')
            }

            fetchClinics()
            onSave()
        } catch (err: any) {
            console.error(err)
            setError(err.message || '院の削除に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">院の管理</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* 新規追加フォーム */}
                    <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">新規追加</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <input
                                type="text"
                                placeholder="院名（例：東京院）"
                                value={newClinicName}
                                onChange={(e) => setNewClinicName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="GoogleレビューURL（任意）"
                                value={newClinicUrl}
                                onChange={(e) => setNewClinicUrl(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleAddClinic}
                            disabled={isLoading || !newClinicName.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm font-medium"
                        >
                            追加する
                        </button>
                    </div>

                    {/* 一覧 */}
                    <div className="space-y-4">
                        {clinics.map((clinic) => (
                            <div
                                key={clinic.id}
                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                {editingClinic?.id === clinic.id ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">院名</label>
                                                <input
                                                    type="text"
                                                    value={editingClinic.name}
                                                    onChange={(e) =>
                                                        setEditingClinic({ ...editingClinic, name: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">GoogleレビューURL</label>
                                                <input
                                                    type="text"
                                                    value={editingClinic.google_review_url || ''}
                                                    onChange={(e) =>
                                                        setEditingClinic({
                                                            ...editingClinic,
                                                            google_review_url: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditingClinic(null)}
                                                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                                            >
                                                キャンセル
                                            </button>
                                            <button
                                                onClick={handleUpdateClinic}
                                                disabled={isLoading}
                                                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                保存
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800">{clinic.name}</h3>
                                            {clinic.google_review_url ? (
                                                <a
                                                    href={clinic.google_review_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-500 hover:underline break-all"
                                                >
                                                    {clinic.google_review_url}
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400">URL未設定</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={() => setEditingClinic(clinic)}
                                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 text-gray-600"
                                            >
                                                編集
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClinic(clinic.id)}
                                                className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm font-medium"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    )
}
