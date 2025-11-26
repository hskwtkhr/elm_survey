import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received survey data:', body)

    // バリデーション
    const {
      clinicId,
      doctorId,
      treatmentDate,
      treatmentMenu,
      gender,
      ageGroup,
      resultSatisfaction,
      counselingSatisfaction,
      atmosphereRating,
      staffServiceRating,
      message,
    } = body

    if (
      !clinicId ||
      !doctorId ||
      !treatmentDate ||
      !treatmentMenu ||
      !gender ||
      !ageGroup
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

    // 施術日のバリデーション（未来の日付は不可）
    const treatmentDateObj = new Date(treatmentDate)
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    if (treatmentDateObj > today) {
      return NextResponse.json(
        { error: '施術日は今日以前の日付を選択してください' },
        { status: 400 }
      )
    }

    // データベースに保存
    // 注意: resultSatisfactionが追加されるまで、satisfactionフィールドに一時的に保存
    const survey = await prisma.survey.create({
      data: {
        clinicId,
        doctorId,
        treatmentDate: treatmentDateObj,
        treatmentMenu,
        gender,
        ageGroup,
        satisfaction: resultSatisfaction || '普通', // resultSatisfactionの値を使用
        message: message || null, // 伝えたいことは任意
        // 以下はデータベースにカラムが追加された後に有効化
        // resultSatisfaction: resultSatisfaction || null,
        // counselingSatisfaction: counselingSatisfaction || null,
        // atmosphereRating: atmosphereRating || null,
        // staffServiceRating: staffServiceRating || null,
      } as any, // 一時的にany型を使用
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: survey.id,
      clinicId: survey.clinicId,
      resultSatisfaction: (survey as any).resultSatisfaction || survey.satisfaction,
      counselingSatisfaction: (survey as any).counselingSatisfaction || null,
      atmosphereRating: (survey as any).atmosphereRating || null,
      staffServiceRating: (survey as any).staffServiceRating || null,
    })
  } catch (error) {
    console.error('Error creating survey:', error)
    const errorMessage = error instanceof Error ? error.message : 'アンケートの保存に失敗しました'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

