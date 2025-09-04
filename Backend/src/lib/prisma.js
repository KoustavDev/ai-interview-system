import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma =
  globalThis.prisma ||
  new PrismaClient().$extends(withAccelerate())

globalThis.prisma = prisma

export default prisma
