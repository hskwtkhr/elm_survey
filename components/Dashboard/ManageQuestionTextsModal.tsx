'use client'

import { useState, useEffect } from 'react'

interface Question {
    id: string
    key: string
    label: string
    order: number
}

interface ManageQuestionTextsModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    embedded?: boolean
}

export default function ManageQuestionTextsModal({
    isOpen,
    onClose,
    onSave,
    embedded = false,
}: ManageQuestionTextsModalProps) {
    const [questions, setQuestions] = useState<Question[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (isOpen) {
            fetchQuestions()
        }
    }, [isOpen])

    const fetchQuestions = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/questions')
            if (res.ok) {
                const data = await res.json()
                setQuestions(data)
            }
        } catch (error) {
            console.error('Error fetching questions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLabelChange = (id: string, newLabel: string) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, label: newLabel } : q))
        )
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Save all questions
            await Promise.all(
                questions.map((q) =>
                    fetch('/api/questions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key: q.key, label: q.label }),
                    })
                )
            )
            onSave()
            if (!embedded) onClose()
            alert('保存しました')
        } catch (error) {
            console.error('Error saving questions:', error)
            alert('保存に失敗しました')
        } finally {
            setIsSaving(false)
        }
    }

    if (!isOpen) return null

    const content = (
        <div className="space-y-6">
            {!embedded && (
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">質問文の編集</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ×
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-8">読み込み中...</div>
            ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {questions.map((question) => (
                        <div key={question.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {getQuestionDescription(question.key)}
                            </label>
                            <input
                                type="text"
                                value={question.label}
                                onChange={(e) => handleLabelChange(question.id, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-black"
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200">
                {!embedded && (
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
                    >
                        キャンセル
                    </button>
                )}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSaving ? '保存中...' : '保存する'}
                </button>
            </div>
        </div>
    )

    if (embedded) {
        return content
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                {content}
            </div>
        </div>
    )
}

function getQuestionDescription(key: string): string {
    const descriptions: Record<string, string> = {
        gender: '第1問 性別',
        ageGroup: '第1問 年齢層',
        clinicId: '第2問 院の選択',
        doctorId: '第3問 先生の選択',
        treatmentDate: '第4問 施術日',
        treatmentMenu: '第5問 施術メニュー',
        resultSatisfaction: '第6問 結果への満足度',
        counselingSatisfaction: '第7問 カウンセリングへの満足度',
        atmosphereRating: '第8問 院内の雰囲気',
        staffServiceRating: '第9問 スタッフの対応',
        message: '第10問 自由記述（メッセージ）',
    }
    return descriptions[key] || key
}
