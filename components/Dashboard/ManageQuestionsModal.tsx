'use client'

import { useState } from 'react'
import ManageDoctorsModal from './ManageDoctorsModal'
import ManageTreatmentMenusModal from './ManageTreatmentMenusModal'
import ManageQuestionOptionsModal from './ManageQuestionOptionsModal'

interface ManageQuestionsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function ManageQuestionsModal({
  isOpen,
  onClose,
  onSave,
}: ManageQuestionsModalProps) {
  const [activeTab, setActiveTab] = useState<'options' | 'menus' | 'doctors'>('options')

  if (!isOpen) return null

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">設問管理</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* タブナビゲーション */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('options')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'options'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              設問選択肢の編集
            </button>
            <button
              onClick={() => setActiveTab('menus')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'menus'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              施術メニューの編集
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'doctors'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              先生名の編集
            </button>
          </div>

          {/* タブコンテンツ */}
          <div className="min-h-[400px]">
            {activeTab === 'options' && (
              <ManageQuestionOptionsModal
                isOpen={true}
                onClose={() => {}}
                onSave={() => {
                  onSave()
                }}
                embedded={true}
              />
            )}
            {activeTab === 'menus' && (
              <ManageTreatmentMenusModal
                isOpen={true}
                onClose={() => {}}
                onSave={() => {
                  onSave()
                }}
                embedded={true}
              />
            )}
            {activeTab === 'doctors' && (
              <ManageDoctorsModal
                isOpen={true}
                onClose={() => {}}
                onSave={() => {
                  onSave()
                }}
                embedded={true}
              />
            )}
          </div>

          <div className="flex gap-4 pt-6 mt-6 border-t">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors border-0"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
    </>
  )
}

