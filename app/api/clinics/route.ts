
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const clinics = await prisma.clinic.findMany({
      include: {
        doctors: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            createdAt: 'asc', // orderカラムがない可能性があるためcreatedAtで代用
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      }
    })

    // 指定された順番で院を取得
    const clinicOrder = [
      '広島院',
      '福岡院',
      '岡山院',
      '京都院',
      '熊本院',
      '大阪院',
      '神戸院',
      '表参道院',
      '麻布院',
    ]

    // 並び替え
    const sortedClinics = [...clinics].sort((a, b) => {
      const indexA = clinicOrder.indexOf(a.name)
      const indexB = clinicOrder.indexOf(b.name)

      // 両方ともリストにある場合
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      // aのみリストにある場合（aを先に）
      if (indexA !== -1) return -1
      // bのみリストにある場合（bを先に）
      if (indexB !== -1) return 1

      // 両方ともリストにない場合は作成日時順
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    return NextResponse.json(sortedClinics)
  } catch (error) {
    console.error('Error fetching clinics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clinics' },
      { status: 500 }
    )
  }
}

// 院の追加
export async function POST(req: Request) {
  try {
    const { name, google_review_url } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const clinic = await prisma.clinic.create({
      data: {
        name,
        google_review_url: google_review_url || '',
      },
    })

    return NextResponse.json(clinic)
  } catch (error) {
    console.error('Error creating clinic:', error)
    return NextResponse.json(
      { error: 'Failed to create clinic' },
      { status: 500 }
    )
  }
}

// 院の更新
export async function PUT(req: Request) {
  try {
    const { id, name, google_review_url } = await req.json()

    if (!id || !name) {
      return NextResponse.json(
        { error: 'ID and Name are required' },
        { status: 400 }
      )
    }

    const clinic = await prisma.clinic.update({
      where: { id },
      data: {
        name,
        google_review_url: google_review_url || '',
      },
    })

    return NextResponse.json(clinic)
  } catch (error) {
    console.error('Error updating clinic:', error)
    return NextResponse.json(
      { error: 'Failed to update clinic' },
      { status: 500 }
    )
  }
}

// 院の削除
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // 関連する医師がいるかチェック
    const doctorsCount = await prisma.doctor.count({
      where: { clinicId: id }
    })

    // 関連するアンケートがあるかチェック
    const surveysCount = await prisma.survey.count({
      where: { clinicId: id }
    })

    if (doctorsCount > 0 || surveysCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete clinic with associated doctors or surveys' },
        { status: 400 }
      )
    }

    await prisma.clinic.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting clinic:', error)
    return NextResponse.json(
      { error: 'Failed to delete clinic' },
      { status: 500 }
    )
  }
}
