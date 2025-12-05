import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { menuId: string } }
) {
  try {
    const { menuId } = params
    const body = await request.json()
    const { name, order } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: '施術メニュー名を入力してください' },
        { status: 400 }
      )
    }

    // メニューの存在確認
    const menu = await prisma.treatmentMenu.findUnique({
      where: { id: menuId },
    })

    if (!menu) {
      return NextResponse.json(
        { error: '指定された施術メニューが見つかりません' },
        { status: 404 }
      )
    }

    // 名前が変更される場合、重複チェック
    if (name.trim() !== menu.name) {
      const existing = await prisma.treatmentMenu.findUnique({
        where: { name: name.trim() },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'この施術メニュー名は既に存在します' },
          { status: 400 }
        )
      }
    }

    // 更新
    const updatedMenu = await prisma.treatmentMenu.update({
      where: { id: menuId },
      data: {
        name: name.trim(),
        order: order !== undefined ? order : menu.order,
      },
    })

    return NextResponse.json(updatedMenu)
  } catch (error) {
    console.error('Error updating treatment menu:', error)
    return NextResponse.json(
      { error: '更新に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { menuId: string } }
) {
  try {
    const { menuId } = params

    // メニューの存在確認
    const menu = await prisma.treatmentMenu.findUnique({
      where: { id: menuId },
    })

    if (!menu) {
      return NextResponse.json(
        { error: '指定された施術メニューが見つかりません' },
        { status: 404 }
      )
    }

    // このメニューを使用しているアンケートがあるか確認
    const surveysUsingMenu = await prisma.survey.count({
      where: {
        treatmentMenu: menu.name,
      },
    })

    if (surveysUsingMenu > 0) {
      return NextResponse.json(
        { error: `この施術メニューは${surveysUsingMenu}件のアンケートで使用されているため削除できません` },
        { status: 400 }
      )
    }

    // 削除
    await prisma.treatmentMenu.delete({
      where: { id: menuId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting treatment menu:', error)
    return NextResponse.json(
      { error: '削除に失敗しました' },
      { status: 500 }
    )
  }
}


