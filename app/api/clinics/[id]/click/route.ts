import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const clinicId = params.id

        if (!clinicId) {
            return NextResponse.json(
                { error: 'Clinic ID is required' },
                { status: 400 }
            )
        }

        const clinic = await prisma.clinic.update({
            where: { id: clinicId },
            data: {
                googleReviewClickCount: {
                    increment: 1,
                },
            },
        })

        return NextResponse.json({
            success: true,
            count: clinic.googleReviewClickCount,
        })
    } catch (error) {
        console.error('Error incrementing click count:', error)
        return NextResponse.json(
            { error: 'Failed to increment click count' },
            { status: 500 }
        )
    }
}
