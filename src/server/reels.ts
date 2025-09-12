import { z } from 'zod'
import { prismaClient } from '@/db'
import { createServerFn } from '@tanstack/react-start'

export const getInfiniteReels = createServerFn({ method: 'GET' })
  .validator((data) => {
    return z
      .object({
        page: z.number()
      })
      .parse(data)
  })
  .handler(async ({ data }) => {
    const { page } = data

    const memes = await prismaClient.meme.findMany({
      where: {
        status: 'PUBLISHED'
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: page * 20,
      take: 20,
      include: {
        video: true
      }
    })

    if (memes.length === 0) {
      return {
        memes: [],
        nextPage: null
      }
    }

    return {
      memes,
      nextPage: page + 1
    }
  })
