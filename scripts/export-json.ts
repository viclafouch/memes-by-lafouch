import fs from 'node:fs/promises'
import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

export const exportJson = async () => {
  const memes = await prismaClient.meme.findMany({
    include: {
      video: true
    }
  })

  await fs.writeFile('./backup.json', JSON.stringify(memes, null, 2))
}

exportJson()
