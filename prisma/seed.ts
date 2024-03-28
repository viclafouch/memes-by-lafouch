/* eslint-disable no-console */
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const postData: Prisma.PostCreateInput[] = [
  {
    title: 'Alice'
  },
  {
    title: 'Bob'
  },
  {
    title: 'Antoine'
  }
]

async function main() {
  console.log(`Start seeding ...`)

  for (const post of postData) {
    // eslint-disable-next-line no-await-in-loop
    const user = await prisma.post.create({
      data: post
    })
    console.log(`Created user with id: ${user.id}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
