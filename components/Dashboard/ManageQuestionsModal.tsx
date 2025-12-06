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
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleClose}
      >
        <div
          className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">設問の編集</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* タブナビゲーション */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('options')}
              className={`flex-1 py-4 text-sm font-medium rounded-md transition-all border-0 ${activeTab === 'options'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              設問選択肢の編集
            </button>
            <button
              onClick={() => setActiveTab('menus')}
              className={`flex-1 py-4 text-sm font-medium rounded-md transition-all border-0 ${activeTab === 'menus'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              施術メニューの編集
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex-1 py-4 text-sm font-medium rounded-md transition-all border-0 ${activeTab === 'doctors'
                ? 'bg-white text-gray-900 shadow'
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
                onClose={() => { }}
                onSave={() => {
                  onSave()
                }}
                embedded={true}
              />
            )}
            {activeTab === 'menus' && (
              <ManageTreatmentMenusModal
                isOpen={true}
                onClose={() => { }}
                onSave={() => {
                  onSave()
                }}
                embedded={true}
              />
            )}
            {activeTab === 'doctors' && (
              <ManageDoctorsModal
                isOpen={true}
                onClose={() => { }}
                onSave={() => {
                  onSave()
                }}
                embedded={true}
              />
            )}
          </div>

        </div>
      </div>
    </>
  )
}

