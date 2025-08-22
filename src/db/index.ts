import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const prismaClient = new PrismaClient().$extends(withAccelerate())
