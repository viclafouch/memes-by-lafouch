import React from 'react'
import prisma from '@/db'
import { Meme } from '@prisma/client'
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

export const getRandomMeme = async ({
  exceptId
}: {
  exceptId?: Meme['id']
} = {}) => {
  const memesCount = await prisma.meme.count()
  const randomIndex = Math.floor(Math.random() * memesCount)

  return prisma.meme.findFirstOrThrow({
    take: 1,
    skip: randomIndex,
    where: {
      NOT: {
        id: exceptId
      }
    }
  })
}
