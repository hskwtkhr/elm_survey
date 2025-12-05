import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { optionId: string } }
) {
  try {
    const { optionId } = params
    const body = await request.json()
    const { label, value, order } = body

    if (!label || !value || label.trim() === '' || value.trim() === '') {
      return NextResponse.json(
        { error: 'ラベルと値を入力してください' },
        { status: 400 }
      )
    }

    // 選択肢の存在確認
    const option = await prisma.questionOption.findUnique({
      where: { id: optionId },
    })

    if (!option) {
      return NextResponse.json(
        { error: '指定された選択肢が見つかりません' },
        { status: 404 }
      )
    }

    // 値が変更される場合、重複チェック
    if (value.trim() !== option.value) {
      const existing = await prisma.questionOption.findUnique({
        where: {
          category_value: {
            category: option.category,
            value: value.trim(),
          },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'この値は既に存在します' },
          { status: 400 }
        )
      }
    }

    // 更新
    const updatedOption = await prisma.questionOption.update({
      where: { id: optionId },
      data: {
        label: label.trim(),
        value: value.trim(),
        order: order !== undefined ? order : option.order,
      },
    })

    return NextResponse.json(updatedOption)
  } catch (error) {
    console.error('Error updating question option:', error)
    return NextResponse.json(
      { error: '更新に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { optionId: string } }
) {
  try {
    const { optionId } = params

    // 選択肢の存在確認
    const option = await prisma.questionOption.findUnique({
      where: { id: optionId },
    })

    if (!option) {
      return NextResponse.json(
        { error: '指定された選択肢が見つかりません' },
        { status: 404 }
      )
    }

    // この選択肢を使用しているアンケートがあるか確認
    const fieldMapping: Record<string, string> = {
      gender: 'gender',
      ageGroup: 'ageGroup',
      satisfaction: 'satisfaction',
      resultSatisfaction: 'resultSatisfaction',
      counselingSatisfaction: 'counselingSatisfaction',
      atmosphereRating: 'atmosphereRating',
      staffServiceRating: 'staffServiceRating',
    }

    const surveyField = fieldMapping[option.category]
    if (surveyField) {
      const surveysUsingOption = await prisma.survey.count({
        where: {
          [surveyField]: option.value,
        },
      })

      if (surveysUsingOption > 0) {
        return NextResponse.json(
          { error: `この選択肢は${surveysUsingOption}件のアンケートで使用されているため削除できません` },
          { status: 400 }
        )
      }
    }

    // 削除
    await prisma.questionOption.delete({
      where: { id: optionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question option:', error)
    return NextResponse.json(
      { error: '削除に失敗しました' },
      { status: 500 }
    )
  }
}


