import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clinicId = searchParams.get('clinicId')

    const where: any = {}
    if (clinicId) {
      where.clinicId = clinicId
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { clinicId: 'asc' },
        { order: 'asc' },
        { name: 'asc' },
      ],
    })

    // 院ごとにグループ化
    const groupedByClinic = doctors.reduce((acc, doctor) => {
      const clinicName = doctor.clinic.name
      if (!acc[clinicName]) {
        acc[clinicName] = {
          clinic: doctor.clinic,
          doctors: [],
        }
      }
      acc[clinicName].doctors.push({
        id: doctor.id,
        name: doctor.name,
        order: doctor.order,
      })
      return acc
    }, {} as Record<string, { clinic: { id: string; name: string }; doctors: { id: string; name: string; order: number }[] }>)

    const CLINIC_ORDER = [
      '広島院',
      '岡山院',
      '熊本院',
      '神戸院',
      '麻布院',
      '福岡院',
      '京都院',
      '大阪院',
      '表参道院',
    ]

    const sortedGroups = Object.values(groupedByClinic).sort((a, b) => {
      const indexA = CLINIC_ORDER.indexOf(a.clinic.name)
      const indexB = CLINIC_ORDER.indexOf(b.clinic.name)

      // 両方ともオーダーリストにある場合
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }

      // Aのみある場合（Aを先に）
      if (indexA !== -1) return -1
      // Bのみある場合（Bを先に）
      if (indexB !== -1) return 1

      // どちらもない場合は名前順
      return a.clinic.name.localeCompare(b.clinic.name)
    })

    return NextResponse.json(sortedGroups)
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clinicId, name, order } = body

    if (!clinicId || !name || name.trim() === '') {
      return NextResponse.json(
        { error: '院と先生名を入力してください' },
        { status: 400 }
      )
    }

    // 院の存在確認
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    })

    if (!clinic) {
      return NextResponse.json(
        { error: '指定された院が見つかりません' },
        { status: 404 }
      )
    }

    // 新しい先生を作成
    const newDoctor = await prisma.doctor.create({
      data: {
        clinicId,
        name: name.trim(),
        order: order ?? 0,
      },
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(newDoctor, { status: 201 })
  } catch (error) {
    console.error('Error creating doctor:', error)
    return NextResponse.json(
      { error: '作成に失敗しました' },
      { status: 500 }
    )
  }
}

