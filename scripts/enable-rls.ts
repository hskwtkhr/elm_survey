import { prisma } from '../lib/db'

async function main() {
    console.log('Enabling Row Level Security (RLS) on all tables...')

    try {
        // Clinic
        await prisma.$executeRawUnsafe(`ALTER TABLE "Clinic" ENABLE ROW LEVEL SECURITY;`)
        console.log('RLS enabled for Clinic')

        // Doctor
        await prisma.$executeRawUnsafe(`ALTER TABLE "Doctor" ENABLE ROW LEVEL SECURITY;`)
        console.log('RLS enabled for Doctor')

        // Survey
        await prisma.$executeRawUnsafe(`ALTER TABLE "Survey" ENABLE ROW LEVEL SECURITY;`)
        console.log('RLS enabled for Survey')

        // AdminUser
        await prisma.$executeRawUnsafe(`ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;`)
        console.log('RLS enabled for AdminUser')

        // TreatmentMenu
        await prisma.$executeRawUnsafe(`ALTER TABLE "TreatmentMenu" ENABLE ROW LEVEL SECURITY;`)
        console.log('RLS enabled for TreatmentMenu')

        // QuestionOption
        await prisma.$executeRawUnsafe(`ALTER TABLE "QuestionOption" ENABLE ROW LEVEL SECURITY;`)
        console.log('RLS enabled for QuestionOption')

        // Question
        await prisma.$executeRawUnsafe(`ALTER TABLE "Question" ENABLE ROW LEVEL SECURITY;`)
        console.log('RLS enabled for Question')

        // RateLimit
        await prisma.$executeRawUnsafe(`ALTER TABLE "RateLimit" ENABLE ROW LEVEL SECURITY;`)
        console.log('RLS enabled for RateLimit')

        console.log('Successfully enabled RLS on all tables.')
    } catch (error) {
        console.error('Error enabling RLS:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
