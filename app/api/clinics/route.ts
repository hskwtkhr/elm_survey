import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // 指定された順番で院を取得
    const clinicOrder = [
      '広島院',
      '福岡院',
      '岡山院',
      '京都院',
      '熊本院',
      '大阪院',
      '神戸院',
      '表参道院',
      '麻布院',
    ]

    const clinics = await prisma.clinic.findMany({
      include: {
        doctors: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // 指定された順番でソート
    clinics.sort((a, b) => {
      const indexA = clinicOrder.indexOf(a.name)
      const indexB = clinicOrder.indexOf(b.name)
      // 順番リストにない場合は最後に配置
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
    
    return NextResponse.json(clinics)
  } catch (error) {
    console.error('Error fetching clinics:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error details:', errorMessage)
    
    // エラー時は詳細なエラーメッセージを返す（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: errorMessage,
          stack: errorStack,
          message: 'Failed to fetch clinics'
        },
        { status: 500 }
      )
    }
    
    // 本番環境では空配列を返す
    return NextResponse.json([], { status: 500 })
  }
}

