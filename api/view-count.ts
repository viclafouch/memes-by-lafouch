/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { setTimeout } from 'node:timers/promises'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { BUNNY_CONFIG } from '../src/constants/bunny.ts'
import { fetchWithZod } from '../src/lib/utils.ts'

const { libraryId: LIBRARY_ID } = BUNNY_CONFIG

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
    `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`,
    {
      method: 'GET',
      headers: getHeaders()
    }
  )
}

export async function GET() {
  const prisma = new PrismaClient()

  const memes = await prisma.meme.findMany({
    include: {
      video: true
    }
  })

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

    await setTimeout(300)
  }

  return Response.json({ success: true })
}

GET()
