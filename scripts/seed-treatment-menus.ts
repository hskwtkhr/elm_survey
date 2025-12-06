import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const defaultMenus = [
    'ボトックス注射',
    'ヒアルロン酸注射',
    '糸リフト',
    'アートメイク',
    'フォトフェイシャル',
    'ポテンツァ',
    'その他',
  ]

  console.log('施術メニューの初期データを投入します...')

  for (let i = 0; i < defaultMenus.length; i++) {
    const menuName = defaultMenus[i]
    const existing = await prisma.treatmentMenu.findUnique({
      where: { name: menuName },
    })

    if (!existing) {
      await prisma.treatmentMenu.create({
        data: {
          name: menuName,
          order: i,
        },
      })
      console.log(`✓ ${menuName} を追加しました`)
    } else {
      console.log(`- ${menuName} は既に存在します`)
    }
  }

  console.log('施術メニューの初期データ投入が完了しました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



