import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const where: any = {}
    if (category) {
      where.category = category
    }

    const options = await prisma.questionOption.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
      ],
    })

    // カテゴリごとにグループ化
    const groupedByCategory = options.reduce((acc, option) => {
      if (!acc[option.category]) {
        acc[option.category] = []
      }
      acc[option.category].push({
        id: option.id,
        label: option.label,
        value: option.value,
        order: option.order,
      })
      return acc
    }, {} as Record<string, { id: string; label: string; value: string; order: number }[]>)

    return NextResponse.json(groupedByCategory)
  } catch (error) {
    console.error('Error fetching question options:', error)
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, label, value, order } = body

    if (!category || !label || !value) {
      return NextResponse.json(
        { error: 'カテゴリ、ラベル、値を入力してください' },
        { status: 400 }
      )
    }

    // 既に存在するか確認
    const existing = await prisma.questionOption.findUnique({
      where: {
        category_value: {
          category,
          value: value.trim(),
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'この選択肢は既に存在します' },
        { status: 400 }
      )
    }

    // 新しい選択肢を作成
    const newOption = await prisma.questionOption.create({
      data: {
        category,
        label: label.trim(),
        value: value.trim(),
        order: order ?? 0,
      },
    })

    return NextResponse.json(newOption, { status: 201 })
  } catch (error) {
    console.error('Error creating question option:', error)
    return NextResponse.json(
      { error: '作成に失敗しました' },
      { status: 500 }
    )
  }
}

