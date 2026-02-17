
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
                google_review_url: 'https://www.google.com/search?q=elmclinic-kumamoto&zx=1771358647955&no_sw_cr=1#lrd=0x3540f5760067dd11:0x5c3ff128b42543a6,3,,,,',
            },
        })
        console.log('Updated Kumamoto clinic review URL')
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
