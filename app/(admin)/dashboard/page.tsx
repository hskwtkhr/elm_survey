'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Filters from '@/components/Dashboard/Filters'
import Charts from '@/components/Dashboard/Charts'
import DataTable from '@/components/Dashboard/DataTable'
import EditSurveyModal from '@/components/Dashboard/EditSurveyModal'
import ManageQuestionsModal from '@/components/Dashboard/ManageQuestionsModal'

interface Clinic {
  id: string
  name: string
}

interface Survey {
  id: string
  clinic: { id: string; name: string }
  doctor: { id: string; name: string }
  treatmentDate: string
  treatmentMenu: string
  gender: string
  ageGroup: string
  satisfaction: string
  createdAt: string
}

interface DashboardData {
  surveys: Survey[]
  totalCount: number
  satisfactionData: { name: string; value: number }[]
  treatmentMenuData: { name: string; value: number }[]
  ageGroupData: { name: string; value: number }[]
  clinicData: { name: string; value: number }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [selectedClinicId, setSelectedClinicId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null)
  const [isManageQuestionsModalOpen, setIsManageQuestionsModalOpen] = useState(false)

  useEffect(() => {
    // 認証チェック
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('adminAuth')
      if (!auth) {
        router.push('/login')
        return
      }
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) return

    // 院一覧を取得
    fetch('/api/clinics')
      .then((res) => res.json())
      .then((data) => setClinics(data))
      .catch((error) => console.error('Error fetching clinics:', error))
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return

    // ダッシュボードデータを取得
    fetchDashboardData()
  }, [selectedClinicId, startDate, endDate, currentPage, isAuthenticated])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedClinicId) params.append('clinicId', selectedClinicId)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      params.append('page', currentPage.toString())
      params.append('limit', '50')

      const response = await fetch(`/api/dashboard?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setDashboardData(data)
      } else {
        console.error('Error fetching dashboard data:', data.error)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedClinicId('')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
  }

  const handleEdit = (survey: Survey) => {
    setEditingSurvey(survey)
  }

  const handleDelete = async (surveyId: string) => {
    try {
      const response = await fetch(`/api/dashboard/${surveyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchDashboardData()
      } else {
        alert('削除に失敗しました')
      }
    } catch (error) {
      console.error('Error deleting survey:', error)
      alert('削除に失敗しました')
    }
  }

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedClinicId) params.append('clinicId', selectedClinicId)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/dashboard/export?${params.toString()}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `survey_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('CSVエクスポートに失敗しました')
    }
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('adminAuth')
      sessionStorage.removeItem('adminUsername')
    }
    router.push('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-red-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">データを読み込んでいます...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-lg text-gray-600">データの取得に失敗しました</p>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(dashboardData.totalCount / 50)

  return (
    <div className="min-h-screen bg-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">ダッシュボード</h1>
            <button
              onClick={() => setIsManageQuestionsModalOpen(true)}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              設問管理
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleExportCSV}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              CSVエクスポート
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>

        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">統計情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {dashboardData.totalCount}
              </div>
              <div className="text-sm text-gray-600">総回答数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {
                  dashboardData.satisfactionData.find((d) => d.name === '大変満足')
                    ?.value || 0
                }
              </div>
              <div className="text-sm text-gray-600">大変満足</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {dashboardData.satisfactionData.find((d) => d.name === '満足')?.value || 0}
              </div>
              <div className="text-sm text-gray-600">満足</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {dashboardData.clinicData.length}
              </div>
              <div className="text-sm text-gray-600">対象院数</div>
            </div>
          </div>
        </div>

        <Filters
          clinics={clinics}
          selectedClinicId={selectedClinicId}
          startDate={startDate}
          endDate={endDate}
          onClinicChange={setSelectedClinicId}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onReset={handleReset}
        />

        <Charts
          satisfactionData={dashboardData.satisfactionData}
          treatmentMenuData={dashboardData.treatmentMenuData}
          ageGroupData={dashboardData.ageGroupData}
          clinicData={dashboardData.clinicData}
        />

        <DataTable
          surveys={dashboardData.surveys}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <EditSurveyModal
          survey={editingSurvey}
          onClose={() => setEditingSurvey(null)}
          onSave={fetchDashboardData}
        />

        <ManageQuestionsModal
          isOpen={isManageQuestionsModalOpen}
          onClose={() => setIsManageQuestionsModalOpen(false)}
          onSave={() => {
            fetchDashboardData()
            // 院一覧も再取得
            fetch('/api/clinics')
              .then((res) => res.json())
              .then((data) => setClinics(data))
              .catch((error) => console.error('Error fetching clinics:', error))
          }}
        />
      </div>
    </div>
  )
}

