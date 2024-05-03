import React from 'react'
import prisma from '@/db'
import 'server-only'

export const getMeme = React.cache(async (id: string) => {
  return prisma.meme.findUnique({
    where: {
      id
    },
    include: {
      video: true
    }
  })
})

export const getRandomMeme = async () => {
  const memesCount = await prisma.meme.count()
  const randomIndex = Math.floor(Math.random() * memesCount)

  return prisma.meme.findFirstOrThrow({
    take: 1,
    skip: randomIndex
  })
}
