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

    // すべてのアンケートデータを取得
    const surveys = await prisma.survey.findMany({
      where,
      include: {
        clinic: {
          select: {
            name: true,
          },
        },
        doctor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // CSV形式に変換
    const headers = [
      'ID',
      '院名',
      '先生名',
      '施術日',
      '施術メニュー',
      '性別',
      '年齢層',
      '満足度',
      '作成日時',
    ]

    const rows = surveys.map((survey) => [
      survey.id,
      survey.clinic.name,
      survey.doctor.name,
      new Date(survey.treatmentDate).toLocaleDateString('ja-JP'),
      survey.treatmentMenu,
      survey.gender,
      survey.ageGroup,
      survey.satisfaction,
      new Date(survey.createdAt).toLocaleString('ja-JP'),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    // BOMを追加してExcelで正しく表示されるようにする
    const bom = '\uFEFF'
    const csvWithBom = bom + csvContent

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="survey_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting CSV:', error)
    return NextResponse.json(
      { error: 'CSVエクスポートに失敗しました' },
      { status: 500 }
    )
  }
}

