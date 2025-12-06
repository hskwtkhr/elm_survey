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
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function DataTable({
  surveys,
  currentPage,
  totalPages,
  onPageChange,
}: DataTableProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">個別データ</h2>
        </div>
        <svg
          className={`w-8 h-8 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    コメント
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    記入日時
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
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-wrap">
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

