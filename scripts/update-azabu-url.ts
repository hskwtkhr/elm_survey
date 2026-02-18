
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const azabu = await prisma.clinic.findFirst({
        where: { name: '麻布院' },
    })

    if (azabu) {
        await prisma.clinic.update({
            where: { id: azabu.id },
            data: {
                google_review_url: 'https://www.google.com/search?q=%E7%BE%8E%E5%AE%B9%E7%9A%AE%E8%86%9A%E7%A7%91%E3%82%A8%E3%83%AB%E3%83%A0%E3%82%AF%E3%83%AA%E3%83%8B%E3%83%83%E3%82%AF%E9%BA%BB%E5%B8%83%E9%99%A2#lrd=0x60188b937ee66d37:0x1810d8dd38554530,3,,,,',
            },
        })
        console.log('Updated Azabu clinic review URL')
    } else {
        console.log('Azabu clinic not found')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
