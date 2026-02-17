
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const kumamoto = await prisma.clinic.findFirst({
        where: { name: '熊本院' },
    })

    if (kumamoto) {
        await prisma.clinic.update({
            where: { id: kumamoto.id },
            data: {
                // zxパラメータなどを削除したクリーンなURL
                google_review_url: 'https://www.google.com/search?q=elmclinic-kumamoto#lrd=0x3540f5760067dd11:0x5c3ff128b42543a6,3,,,,',
            },
        })
        console.log('Updated Kumamoto clinic review URL (Clean version)')
    } else {
        console.log('Kumamoto clinic not found')
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
