import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  try {
    const { surveyId } = params

    await prisma.survey.delete({
      where: { id: surveyId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting survey:', error)
    return NextResponse.json(
      { error: '削除に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  try {
    const { surveyId } = params
    const body = await request.json()

    const {
      clinicId,
      doctorId,
      treatmentDate,
      treatmentMenu,
      gender,
      ageGroup,
      satisfaction,
    } = body

    // バリデーション
    if (
      !clinicId ||
      !doctorId ||
      !treatmentDate ||
      !treatmentMenu ||
      !gender ||
      !ageGroup ||
      !satisfaction
    ) {
      return NextResponse.json(
        { error: 'すべての項目を入力してください' },
        { status: 400 }
      )
    }

    // 院と先生の存在確認
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    })

    if (!clinic) {
      return NextResponse.json(
        { error: '指定された院が見つかりません' },
        { status: 404 }
      )
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    })

    if (!doctor || doctor.clinicId !== clinicId) {
      return NextResponse.json(
        { error: '指定された先生が見つかりません' },
        { status: 404 }
      )
    }

    // 更新
    const survey = await prisma.survey.update({
      where: { id: surveyId },
      data: {
        clinicId,
        doctorId,
        treatmentDate: new Date(treatmentDate),
        treatmentMenu,
        gender,
        ageGroup,
        satisfaction,
      },
    })

    return NextResponse.json(survey)
  } catch (error) {
    console.error('Error updating survey:', error)
    return NextResponse.json(
      { error: '更新に失敗しました' },
      { status: 500 }
    )
  }
}

