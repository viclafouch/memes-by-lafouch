/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import type { ZodType } from 'zod'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const BUNNY_CONFIG = {
  collectionId: '3d12803f-7837-4586-87c7-7e8cb2789761',
  libraryId: 471900
} as const

async function fetchWithZod<T>(
  schema: ZodType<T>,
  ...args: Parameters<typeof fetch>
): Promise<T> {
  const response = await fetch(...args)

  if (!response.ok) {
    try {
      const error = await response.json()

      throw new Error(
        `Fetch failed with status ${response.status}: ${error.message}`
      )
    } catch (error) {
      throw new Error(`Fetch failed with status ${response.status}`)
    }
  }

  const result = await response.json()

  if (process.env.NODE_ENV === 'development') {
    console.log(`Response for url : ${response.url}`, result)
  }

  return schema.parse(result, {
    reportInput: process.env.NODE_ENV === 'development'
  })
}

const getHeaders = () => {
  const headers = new Headers()
  headers.set('AccessKey', z.string().parse(process.env.BUNNY_ACCESS_KEY))
  headers.set('accept', 'application/json')
  headers.set('Content-Type', 'application/json')

  return headers
}

const getVideo = async (videoId: string) => {
  return fetchWithZod(
    z.object({ views: z.number() }),
    `https://video.bunnycdn.com/library/${BUNNY_CONFIG.libraryId}/videos/${videoId}`,
    {
      method: 'GET',
      headers: getHeaders()
    }
  )
}

export default async function handler() {
  const prisma = new PrismaClient()

  const memes = await prisma.meme.findMany({
    include: {
      video: true
    }
  })

  console.log('Found memes', memes.length)

  for (const meme of memes) {
    const { bunnyId } = meme.video

    const { views } = await getVideo(bunnyId)

    await prisma.meme.update({
      where: {
        id: meme.id
      },
      data: {
        viewCount: views
      }
    })

    console.log(`Updated meme (${meme.id}) viewCount column to `, views)
  }

  return Response.json({ success: true })
}
