import prisma from 'src/db'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

const getRandomMeme = createServerFn({
  method: 'GET'
}).handler(async () => {
  const memes = await prisma.meme.findMany()
  const randomIndex = Math.floor(Math.random() * memes.length)
  const meme = memes[randomIndex]

  return meme
})

export const Route = createFileRoute('/dashboard/random/')({
  beforeLoad: async () => {
    const randomMeme = await getRandomMeme()

    throw redirect({
      to: '/dashboard/random/$memeId',
      params: {
        memeId: randomMeme.id
      }
    })
  }
})
