import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { menuIds } = body

    if (!Array.isArray(menuIds)) {
      return NextResponse.json(
        { error: 'menuIdsは配列である必要があります' },
        { status: 400 }
      )
    }

    // 各メニューの順番を更新
    const updatePromises = menuIds.map((menuId: string, index: number) =>
      prisma.treatmentMenu.update({
        where: { id: menuId },
        data: { order: index },
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering treatment menus:', error)
    return NextResponse.json(
      { error: '順番の更新に失敗しました' },
      { status: 500 }
    )
  }
}



