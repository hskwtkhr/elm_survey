import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  try {
    const { doctorId } = params
    const body = await request.json()
    const { name, order } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: '先生名を入力してください' },
        { status: 400 }
      )
    }

    // 先生の存在確認
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    })

    if (!doctor) {
      return NextResponse.json(
        { error: '指定された先生が見つかりません' },
        { status: 404 }
      )
    }

    // 更新
    const updateData: { name: string; order?: number } = {
      name: name.trim(),
    }
    if (order !== undefined) {
      updateData.order = order
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: updateData,
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(updatedDoctor)
  } catch (error) {
    console.error('Error updating doctor:', error)
    return NextResponse.json(
      { error: '更新に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  try {
    const { doctorId } = params

    // 先生の存在確認
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    })

    if (!doctor) {
      return NextResponse.json(
        { error: '指定された先生が見つかりません' },
        { status: 404 }
      )
    }

    // この先生を使用しているアンケートがあるか確認
    const surveysUsingDoctor = await prisma.survey.count({
      where: {
        doctorId: doctorId,
      },
    })

    if (surveysUsingDoctor > 0) {
      return NextResponse.json(
        { error: `この先生は${surveysUsingDoctor}件のアンケートで使用されているため削除できません` },
        { status: 400 }
      )
    }

    // 削除
    await prisma.doctor.delete({
      where: { id: doctorId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting doctor:', error)
    return NextResponse.json(
      { error: '削除に失敗しました' },
      { status: 500 }
    )
  }
}

