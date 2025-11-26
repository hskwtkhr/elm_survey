import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 簡易的な認証チェック（実際の実装ではJWTやセッションを使用）
  const authHeader = request.headers.get('authorization')

  if (authHeader === 'Bearer admin') {
    return NextResponse.json({ authenticated: true })
  }

  return NextResponse.json(
    { authenticated: false },
    { status: 401 }
  )
}

