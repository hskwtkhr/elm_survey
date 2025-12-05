import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { optionIds, category } = body

    if (!Array.isArray(optionIds) || !category) {
      return NextResponse.json(
        { error: 'optionIdsは配列、categoryは必須です' },
        { status: 400 }
      )
    }

    // 各選択肢の順番を更新
    const updatePromises = optionIds.map((optionId: string, index: number) =>
      prisma.questionOption.update({
        where: { id: optionId },
        data: { order: index },
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering question options:', error)
    return NextResponse.json(
      { error: '順番の更新に失敗しました' },
      { status: 500 }
    )
  }
}


