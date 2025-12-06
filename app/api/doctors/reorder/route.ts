import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { doctorIds } = body

    if (!Array.isArray(doctorIds)) {
      return NextResponse.json(
        { error: 'doctorIdsは配列である必要があります' },
        { status: 400 }
      )
    }

    // 各先生の順番を更新
    const updatePromises = doctorIds.map((doctorId: string, index: number) =>
      prisma.doctor.update({
        where: { id: doctorId },
        data: { order: index },
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering doctors:', error)
    return NextResponse.json(
      { error: '順番の更新に失敗しました' },
      { status: 500 }
    )
  }
}



