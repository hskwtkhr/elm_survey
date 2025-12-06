'use client'

import { useState } from 'react'

interface Survey {
  id: string
  clinic: { id: string; name: string }
  doctor: { id: string; name: string }
  treatmentDate: string
  treatmentMenu: string
  gender: string
  ageGroup: string
  satisfaction: string
  message: string | null
  createdAt: string
}

interface DataTableProps {
  surveys: Survey[]
  onEdit: (survey: Survey) => void
  onDelete: (surveyId: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function DataTable({
  surveys,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: DataTableProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">個別データ</h2>
          <span className="text-sm text-gray-500">
            {isExpanded ? 'クリックして閉じる' : 'クリックして詳細データを表示'}
          </span>
        </div>
        <svg
          className={`w-6 h-6 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    院名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    先生名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    施術日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    施術メニュー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    性別
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    年齢層
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    満足度
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    コメント
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    記入日時
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {surveys.map((survey) => (
                  <tr key={survey.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {survey.clinic.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {survey.doctor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(survey.treatmentDate).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {survey.treatmentMenu}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {survey.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {survey.ageGroup}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {survey.satisfaction}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={survey.message || ''}>
                      {survey.message || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(survey.createdAt).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(survey)
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        編集
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('このアンケートを削除しますか？')) {
                            onDelete(survey.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPageChange(currentPage - 1)
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 border-0 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
            >
              前へ
            </button>
            <span className="px-4 text-gray-900">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPageChange(currentPage + 1)
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border-0 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
            >
              次へ
            </button>
          </div>
        </>
      )}
    </div>
  )
}

