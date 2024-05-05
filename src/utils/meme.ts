import React from 'react'
import { unstable_cache } from 'next/cache'
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

const getAllMemes = unstable_cache(async () => {
  const memes = prisma.meme.findMany()

  return memes
})

export const getRandomMeme = async ({
  exceptId
}: {
  exceptId?: Meme['id']
} = {}) => {
  const memes = await getAllMemes()
  const withoutCurrentMeme = memes.filter((meme) => {
    return meme.id !== exceptId
  })

  const randomIndex = Math.floor(Math.random() * withoutCurrentMeme.length)

  return withoutCurrentMeme[randomIndex]
}
