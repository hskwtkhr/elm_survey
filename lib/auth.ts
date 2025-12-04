import bcrypt from 'bcryptjs'
import { prisma } from './db'

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function createAdminUser(username: string, password: string) {
  const passwordHash = await hashPassword(password)
  return prisma.adminUser.create({
    data: {
      username,
      passwordHash,
    },
  })
}

export async function verifyAdminUser(
  username: string,
  password: string
): Promise<boolean> {
  const user = await prisma.adminUser.findUnique({
    where: { username },
  })

  if (!user) {
    return false
  }

  return verifyPassword(password, user.passwordHash)
}


