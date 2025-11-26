import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// このAPI Routeは動的に実行される
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // データベース接続テスト
    await prisma.$queryRaw`SELECT 1`
    
    // テーブル名の確認
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('Clinic', 'Doctor', 'Survey', 'AdminUser')
      ORDER BY tablename
    `
    
    // シンプルなクエリでデータ取得テスト
    const clinicCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM "Clinic"
    `
    
    // Prisma Clientを使ったクエリテスト
    let prismaTestResult = null
    try {
      const testQuery = await prisma.clinic.findMany({
        take: 1,
      })
      prismaTestResult = `Success: Found ${testQuery.length} clinic(s)`
    } catch (prismaError) {
      prismaTestResult = `Error: ${prismaError instanceof Error ? prismaError.message : 'Unknown error'}`
    }
    
    return NextResponse.json({
      success: true,
      databaseConnected: true,
      tables: tables.map(t => t.tablename),
      clinicCount: Number(clinicCount[0]?.count || 0),
      prismaTest: prismaTestResult,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorName = error instanceof Error ? error.name : 'Unknown'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      errorName: errorName,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      stack: errorStack,
    }, { status: 500 })
  }
}

