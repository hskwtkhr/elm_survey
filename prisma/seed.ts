import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 院情報と先生情報を定義（指定された順番通り）
  const clinicsData = [
    {
      name: '広島院',
      google_review_url: 'https://g.page/elmclinic-hiroshima/review',
      doctors: ['相原先生', '松本院長', '花ノ木先生', '高木先生', '看護師'],
    },
    {
      name: '福岡院',
      google_review_url: 'https://g.page/elmclinic-fukuoka/review',
      doctors: ['菊池院長', '白水先生', '早川先生', '看護師'],
    },
    {
      name: '岡山院',
      google_review_url: 'https://g.page/elmclinic-okayama/review',
      doctors: ['高橋院長', '看護師'],
    },
    {
      name: '京都院',
      google_review_url: 'https://g.page/elmclinic-kyoto/review',
      doctors: ['内山院長', '看護師'],
    },
    {
      name: '熊本院',
      google_review_url: 'https://g.page/elmclinic-kumamoto/review',
      doctors: ['佐古院長', '境先生', '看護師'],
    },
    {
      name: '大阪院',
      google_review_url: 'https://g.page/elmclinic-osaka/review',
      doctors: ['佐藤院長', '看護師'],
    },
    {
      name: '神戸院',
      google_review_url: 'https://g.page/elmclinic-kobe/review',
      doctors: ['七里院長', '看護師'],
    },
    {
      name: '表参道院',
      google_review_url: 'https://g.page/elmclinic-omotesando/review',
      doctors: ['土井院長', '藤内先生', '看護師'],
    },
    {
      name: '麻布院',
      google_review_url: 'https://g.page/elmclinic-azabu/review',
      doctors: ['先生', '看護師'],
    },
  ]

  // 既存データをクリア
  await prisma.survey.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.clinic.deleteMany()

  // 院と先生を登録
  for (const clinicData of clinicsData) {
    const clinic = await prisma.clinic.create({
      data: {
        name: clinicData.name,
        google_review_url: clinicData.google_review_url,
        doctors: {
          create: clinicData.doctors.map((doctorName) => ({
            name: doctorName,
          })),
        },
      },
    })
    console.log(`Created clinic: ${clinic.name} with ${clinicData.doctors.length} doctors`)
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

