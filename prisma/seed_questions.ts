import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const questions = [
        { key: 'gender', label: '性別を選択してください', order: 1 },
        { key: 'ageGroup', label: '年齢層を選択してください', order: 2 },
        { key: 'clinicId', label: 'どちらの院で施術を受けられましたか？', order: 3 },
        { key: 'doctorId', label: 'どちらの先生に施術していただきましたか？', order: 4 },
        { key: 'treatmentDate', label: '施術日を選択してください', order: 5 },
        { key: 'treatmentMenu', label: 'どの施術メニューを受けられましたか？', order: 6 },
        { key: 'resultSatisfaction', label: '施術結果に満足できましたか？', order: 7 },
        { key: 'counselingSatisfaction', label: 'カウンセリングはご希望に沿った内容でしたか？', order: 8 },
        { key: 'atmosphereRating', label: '院内の雰囲気はいかがでしたか？', order: 9 },
        { key: 'staffServiceRating', label: 'スタッフの対応はいかがでしたか？', order: 10 },
        { key: 'message', label: '伝えたいことの他に改善点などがありましたら…（任意）', order: 11 },
    ]

    for (const q of questions) {
        await prisma.question.upsert({
            where: { key: q.key },
            update: { label: q.label, order: q.order },
            create: { key: q.key, label: q.label, order: q.order },
        })
    }

    console.log('Seed data for questions inserted')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
