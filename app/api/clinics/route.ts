import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される（静的生成時には実行しない）
export const dynamic = 'force-dynamic'

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

    // IDで重複を削除（念のため）
    const uniqueClinics = Array.from(
      new Map(clinics.map(clinic => [clinic.id, clinic])).values()
    )

    // 指定された順番でソート
    uniqueClinics.sort((a, b) => {
      const indexA = clinicOrder.indexOf(a.name)
      const indexB = clinicOrder.indexOf(b.name)
      // 順番リストにない場合は最後に配置
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
    
    return NextResponse.json(uniqueClinics)
  } catch (error) {
    console.error('Error fetching clinics:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    const errorName = error instanceof Error ? error.name : 'Unknown'
    
    console.error('Error name:', errorName)
    console.error('Error details:', errorMessage)
    console.error('Error stack:', errorStack)
    
    // DATABASE_URLの設定状況を確認（セキュリティのため、実際のURLは返さない）
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    console.error('DATABASE_URL is set:', hasDatabaseUrl)
    
    // 本番環境でもエラーメッセージを返す（デバッグ用）
    return NextResponse.json(
      { 
        error: errorMessage,
        errorName: errorName,
        message: 'Failed to fetch clinics',
        hasDatabaseUrl: hasDatabaseUrl,
        // 本番環境でもスタックトレースを含める（一時的なデバッグ用）
        ...(errorStack && { stack: errorStack })
      },
      { status: 500 }
    )
  }
}

