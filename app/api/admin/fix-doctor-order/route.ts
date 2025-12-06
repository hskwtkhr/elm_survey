import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const clinics = await prisma.clinic.findMany({
            where: {
                name: {
                    in: ['麻布院', '大阪院']
                }
            },
            include: {
                doctors: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        })

        const results = []

        for (const clinic of clinics) {
            const doctors = clinic.doctors
            // Reverse the order
            const reversedDoctors = [...doctors].reverse()

            // Update each doctor's order
            for (let i = 0; i < reversedDoctors.length; i++) {
                const doctor = reversedDoctors[i]
                await prisma.doctor.update({
                    where: { id: doctor.id },
                    data: { order: i }
                })
            }

            results.push({
                clinic: clinic.name,
                originalOrder: doctors.map(d => d.name),
                newOrder: reversedDoctors.map(d => d.name)
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Doctor order reversed for Azabu and Osaka clinics',
            details: results
        })
    } catch (error) {
        console.error('Error fixing doctor order:', error)
        return NextResponse.json(
            { error: 'Failed to fix doctor order', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
