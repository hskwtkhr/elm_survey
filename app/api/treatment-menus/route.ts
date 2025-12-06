import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const menus = await prisma.treatmentMenu.findMany({
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json(menus)
  } catch (error) {
    console.error('Error fetching treatment menus:', error)
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, order } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: '施術メニュー名を入力してください' },
        { status: 400 }
      )
    }

    // 既に存在するか確認
    const existing = await prisma.treatmentMenu.findUnique({
      where: { name: name.trim() },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'この施術メニューは既に存在します' },
        { status: 400 }
      )
    }

    // 新しいメニューを作成
    const newMenu = await prisma.treatmentMenu.create({
      data: {
        name: name.trim(),
        order: order ?? 0,
      },
    })

    return NextResponse.json(newMenu, { status: 201 })
  } catch (error) {
    console.error('Error creating treatment menu:', error)
    return NextResponse.json(
      { error: '作成に失敗しました' },
      { status: 500 }
    )
  }
}



