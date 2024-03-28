/* eslint-disable no-console */
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const postData: Prisma.MemeCreateInput[] = [
  {
    title: 'Meme 1',
    videoUrl:
      'https://utfs.io/f/5c0af5ce-9632-4dd0-9282-59235dd8aabf-z3zuq.com_vickymykh_616207.mp4'
  },
  {
    title: 'Meme 2',
    videoUrl:
      'https://utfs.io/f/5c0af5ce-9632-4dd0-9282-59235dd8aabf-z3zuq.com_vickymykh_616207.mp4'
  },
  {
    title: 'Meme 3',
    videoUrl:
      'https://utfs.io/f/5c0af5ce-9632-4dd0-9282-59235dd8aabf-z3zuq.com_vickymykh_616207.mp4'
  }
]

async function main() {
  console.log(`Start seeding ...`)

  for (const post of postData) {
    // eslint-disable-next-line no-await-in-loop
    const meme = await prisma.meme.create({
      data: post
    })
    console.log(`Created meme with id: ${meme.id}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error: unknown) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
