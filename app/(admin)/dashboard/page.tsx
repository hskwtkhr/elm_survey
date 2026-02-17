'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import { signOut } from 'next-auth/react'
import Filters from '@/components/Dashboard/Filters'
import Charts from '@/components/Dashboard/Charts'
import DataTable from '@/components/Dashboard/DataTable'
import ManageQuestionsModal from '@/components/Dashboard/ManageQuestionsModal'
import ManageClinicsModal from '@/components/Dashboard/ManageClinicsModal'

import ClickDetailsModal from '@/components/Dashboard/ClickDetailsModal'

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
  message: string | null
  createdAt: string
}

interface DashboardData {
  surveys: Survey[]
  totalCount: number
  satisfactionData: { name: string; value: number }[]
  treatmentMenuData: { name: string; value: number }[]
  ageGroupData: { name: string; value: number }[]
  clinicData: { name: string; value: number }[]
  clickData: { name: string; googleReviewClickCount: number }[]
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
  const [isManageQuestionsModalOpen, setIsManageQuestionsModalOpen] = useState(false)
  const [isManageClinicsModalOpen, setIsManageClinicsModalOpen] = useState(false)
  const [isClickDetailsModalOpen, setIsClickDetailsModalOpen] = useState(false)

  useEffect(() => {
    // 院一覧を取得
    fetch('/api/clinics')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch clinics')
        }
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setClinics(data)
        } else {
          console.error('Invalid clinics data:', data)
          setClinics([])
        }
      })
      .catch((error) => {
        console.error('Error fetching clinics:', error)
        setClinics([])
      })
  }, [])

  useEffect(() => {
    // ダッシュボードデータを取得
    fetchDashboardData()
  }, [selectedClinicId, startDate, endDate, currentPage])

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

      if (response.status === 401) {
        // ミドルウェアで弾かれるはずだが、念のため
        router.push('/login')
        return
      }

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

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 transition-opacity duration-300 relative">
        {/* Loading Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-[2px]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent shadow-lg mb-4"></div>
          <p className="text-xl font-bold text-blue-600 tracking-wider animate-pulse">Loading...</p>
        </div>

        {/* Background Skeleton */}
        <div className="max-w-7xl mx-auto animate-pulse space-y-8 opacity-50">
          {/* Header Skeleton */}
          <div className="flex justify-between items-end mb-8">
            <div className="h-12 w-48 bg-gray-200 rounded-lg"></div>
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-gray-200 rounded-lg"></div>
              <div className="h-12 w-32 bg-gray-200 rounded-lg"></div>
              <div className="h-12 w-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="mb-6 bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center p-4">
                  <div className="h-10 w-16 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters Skeleton */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
            <div className="h-10 w-40 bg-gray-200 rounded"></div>
            <div className="h-10 w-40 bg-gray-200 rounded"></div>
            <div className="h-10 w-40 bg-gray-200 rounded"></div>
            <div className="h-10 w-24 bg-gray-200 rounded ml-auto"></div>
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-80">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-full w-full bg-gray-100 rounded-full opacity-50 mx-auto aspect-square max-h-56"></div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-80">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-full w-full bg-gray-100 rounded opacity-50"></div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex justify-between">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-8 w-full bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-lg text-gray-600">データの取得に失敗しました</p>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(dashboardData.totalCount / 50)
  const totalClicks = dashboardData.clickData?.reduce((acc, curr) => acc + curr.googleReviewClickCount, 0) || 0

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <NextImage
              src="/elm_logo.png"
              alt="ELM CLINIC"
              width={300}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsManageClinicsModalOpen(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors border-0 text-lg font-medium"
            >
              院の管理
            </button>
            <button
              onClick={() => setIsManageQuestionsModalOpen(true)}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors border-0 text-lg font-medium"
            >
              設問の編集
            </button>
            <button
              onClick={handleExportCSV}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors border-0 text-lg font-medium"
            >
              CSVエクスポート
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors border-0 text-lg font-medium"
            >
              ログアウト
            </button>
          </div>
        </div>

        <div className="mb-6 bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">統計情報</h2>
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
            <div className="text-center relative">
              <div className="text-3xl font-bold text-pink-600">
                {totalClicks}
              </div>
              <div className="text-sm text-gray-600 mb-2">口コミボタンクリック数</div>
              <button
                onClick={() => setIsClickDetailsModalOpen(true)}
                className="text-xs text-blue-500 hover:text-blue-700 underline"
              >
                詳細を見る
              </button>
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
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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

        <ManageClinicsModal
          isOpen={isManageClinicsModalOpen}
          onClose={() => setIsManageClinicsModalOpen(false)}
          onSave={() => {
            // 院一覧を再取得
            fetch('/api/clinics')
              .then((res) => res.json())
              .then((data) => setClinics(data))
              .catch((error) => console.error('Error fetching clinics:', error))
          }}
        />

        <ClickDetailsModal
          isOpen={isClickDetailsModalOpen}
          onClose={() => setIsClickDetailsModalOpen(false)}
          data={dashboardData.clickData || []}
        />
      </div>
    </div>
  )
}

