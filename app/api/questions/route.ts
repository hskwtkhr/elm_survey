import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const questions = await prisma.question.findMany({
            orderBy: {
                order: 'asc',
            },
        })
        return NextResponse.json(questions)
    } catch (error) {
        console.error('Error fetching questions:', error)
        return NextResponse.json(
            { error: 'Failed to fetch questions' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { key, label } = body

        if (!key || !label) {
            return NextResponse.json(
                { error: 'Key and label are required' },
                { status: 400 }
            )
        }

        const question = await prisma.question.upsert({
            where: { key },
            update: { label },
            create: { key, label },
        })

        return NextResponse.json(question)
    } catch (error) {
        console.error('Error updating question:', error)
        return NextResponse.json(
            { error: 'Failed to update question' },
            { status: 500 }
        )
    }
}
