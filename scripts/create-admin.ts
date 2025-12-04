import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const username = 'admin'
  const password = 'admin123' // 変更してください

  // パスワードをハッシュ化
  const passwordHash = await bcrypt.hash(password, 10)

  // 既存の管理者を確認
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username },
  })

  if (existingAdmin) {
    console.log(`管理者アカウント "${username}" は既に存在します。`)
    console.log('パスワードを更新しますか？')
    
    // パスワードを更新
    await prisma.adminUser.update({
      where: { username },
      data: { passwordHash },
    })
    console.log('✅ パスワードを更新しました')
  } else {
    // 新規作成
    await prisma.adminUser.create({
      data: {
        username,
        passwordHash,
      },
    })
    console.log('✅ 管理者アカウントを作成しました')
  }

  console.log(`\nユーザー名: ${username}`)
  console.log(`パスワード: ${password}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


