import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clinicId = searchParams.get('clinicId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // フィルター条件を構築
    const where: any = {}

    if (clinicId) {
      where.clinicId = clinicId
    }

    if (startDate || endDate) {
      where.treatmentDate = {}
      if (startDate) {
        where.treatmentDate.gte = new Date(startDate)
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        where.treatmentDate.lte = end
      }
    }

    // 総件数を取得
    const totalCount = await prisma.survey.count({ where })

    // アンケートデータを取得
    const surveys = await prisma.survey.findMany({
      where,
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    // 集計データを取得
    const allSurveys = await prisma.survey.findMany({
      where,
      select: {
        satisfaction: true,
        treatmentMenu: true,
        ageGroup: true,
        clinic: {
          select: {
            name: true,
          },
        },
      },
    })

    // 満足度別集計
    const satisfactionCount: Record<string, number> = {}
    allSurveys.forEach((survey) => {
      satisfactionCount[survey.satisfaction] =
        (satisfactionCount[survey.satisfaction] || 0) + 1
    })
    const satisfactionData = Object.entries(satisfactionCount).map(
      ([name, value]) => ({ name, value })
    )

    // 施術メニュー別集計
    const treatmentMenuCount: Record<string, number> = {}
    allSurveys.forEach((survey) => {
      treatmentMenuCount[survey.treatmentMenu] =
        (treatmentMenuCount[survey.treatmentMenu] || 0) + 1
    })
    const treatmentMenuData = Object.entries(treatmentMenuCount).map(
      ([name, value]) => ({ name, value })
    )

    // 年齢層別集計
    const ageGroupCount: Record<string, number> = {}
    allSurveys.forEach((survey) => {
      ageGroupCount[survey.ageGroup] = (ageGroupCount[survey.ageGroup] || 0) + 1
    })
    const ageGroupData = Object.entries(ageGroupCount).map(([name, value]) => ({
      name,
      value,
    }))

    // 院別集計
    const clinicCount: Record<string, number> = {}
    allSurveys.forEach((survey) => {
      clinicCount[survey.clinic.name] = (clinicCount[survey.clinic.name] || 0) + 1
    })
    const clinicData = Object.entries(clinicCount).map(([name, value]) => ({
      name,
      value,
    }))

    return NextResponse.json({
      surveys,
      totalCount,
      satisfactionData,
      treatmentMenuData,
      ageGroupData,
      clinicData,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    )
  }
}

