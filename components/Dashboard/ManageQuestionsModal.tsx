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
  const [activeTab, setActiveTab] = useState<'doctors' | 'menus' | 'options'>('options')
  const [isManageDoctorsOpen, setIsManageDoctorsOpen] = useState(false)
  const [isManageMenusOpen, setIsManageMenusOpen] = useState(false)
  const [isManageOptionsOpen, setIsManageOptionsOpen] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setIsManageDoctorsOpen(false)
    setIsManageMenusOpen(false)
    setIsManageOptionsOpen(false)
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
              onClick={() => setActiveTab('doctors')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'doctors'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              先生名の管理
            </button>
            <button
              onClick={() => setActiveTab('menus')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'menus'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              施術メニューの管理
            </button>
            <button
              onClick={() => setActiveTab('options')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'options'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              設問選択肢の管理
            </button>
          </div>

          {/* タブコンテンツ */}
          <div className="min-h-[400px]">
            {(() => {
              if (activeTab === 'doctors') {
                return (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-blue-900 mb-2 text-gray-900">先生名の管理について</h3>
                      <p className="text-sm text-blue-800">
                        アンケートフォームで選択できる先生名を管理します。<br />
                        院ごとに先生を追加・編集・削除でき、ドラッグ＆ドロップで表示順を変更できます。
                      </p>
                    </div>
                    <button
                      onClick={() => setIsManageDoctorsOpen(true)}
                      className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                    >
                      先生名を管理する
                    </button>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-gray-900">注意事項</h4>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>先生名を削除する場合、その先生が使用されているアンケートがあると削除できません</li>
                        <li>先生名の順番は、アンケートフォームでの表示順に影響します</li>
                        <li>院ごとに先生を管理します</li>
                      </ul>
                    </div>
                  </div>
                )
              }

              if (activeTab === 'menus') {
                return (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-indigo-900 mb-2 text-gray-900">施術メニューの管理について</h3>
                      <p className="text-sm text-indigo-800">
                        アンケートフォームで選択できる施術メニューを管理します。<br />
                        メニューを追加・編集・削除でき、ドラッグ＆ドロップで表示順を変更できます。
                      </p>
                    </div>
                    <button
                      onClick={() => setIsManageMenusOpen(true)}
                      className="w-full px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
                    >
                      施術メニューを管理する
                    </button>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-gray-900">注意事項</h4>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>施術メニューを削除する場合、そのメニューが使用されているアンケートがあると削除できません</li>
                        <li>メニューの順番は、アンケートフォームでの表示順に影響します</li>
                        <li>新しいメニューを追加すると、アンケートフォームにすぐに反映されます</li>
                      </ul>
                    </div>
                  </div>
                )
              }

              return (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-green-900 mb-2">設問選択肢の管理について</h3>
                    <p className="text-sm text-green-800">
                      アンケートフォームで使用される選択肢（性別、年齢層、満足度など）を管理します。<br />
                      各カテゴリの選択肢を追加・編集・削除でき、ドラッグ＆ドロップで表示順を変更できます。
                    </p>
                  </div>
                  <button
                    onClick={() => setIsManageOptionsOpen(true)}
                    className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    設問選択肢を管理する
                  </button>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-gray-900">注意事項</h4>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>選択肢を削除する場合、その選択肢が使用されているアンケートがあると削除できません</li>
                      <li>選択肢の順番は、アンケートフォームでの表示順に影響します</li>
                      <li>「表示ラベル」はフォームに表示され、「値」はデータベースに保存されます</li>
                      <li>カテゴリごとに選択肢を管理します</li>
                    </ul>
                  </div>
                </div>
              )
            })()}
          </div>

          <div className="flex gap-4 pt-6 mt-6 border-t">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>

      {/* 先生名管理モーダル */}
      <ManageDoctorsModal
        isOpen={isManageDoctorsOpen}
        onClose={() => setIsManageDoctorsOpen(false)}
        onSave={() => {
          onSave()
          setIsManageDoctorsOpen(false)
        }}
      />

      {/* 施術メニュー管理モーダル */}
      <ManageTreatmentMenusModal
        isOpen={isManageMenusOpen}
        onClose={() => setIsManageMenusOpen(false)}
        onSave={() => {
          onSave()
          setIsManageMenusOpen(false)
        }}
      />

      {/* 設問選択肢管理モーダル */}
      <ManageQuestionOptionsModal
        isOpen={isManageOptionsOpen}
        onClose={() => setIsManageOptionsOpen(false)}
        onSave={() => {
          onSave()
          setIsManageOptionsOpen(false)
        }}
      />
    </>
  )
}

