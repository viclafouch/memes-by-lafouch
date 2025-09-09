import { z } from 'zod'
import { prismaClient } from '@/db'
import {
  algoliaClient,
  algoliaIndexName,
  memeToAlgoliaRecord
} from '@/lib/algolia'
import { getVideoPlayData } from '@/lib/bunny'
import { createServerFileRoute } from '@tanstack/react-start/server'

// see https://docs.bunny.net/docs/stream-webhook
const WEBHOOK_RESPONSE_SCHEMA = z.object({
  VideoLibraryId: z.number(),
  VideoGuid: z.string(),
  Status: z.number()
})

export const ServerRoute = createServerFileRoute('/api/bunny').methods({
  POST: async ({ request }) => {
    const data = await request.json()
    const result = WEBHOOK_RESPONSE_SCHEMA.parse(data)

    const videoPlayData = await getVideoPlayData(result.VideoGuid)

    const { meme } = await prismaClient.video.update({
      where: {
        bunnyId: result.VideoGuid,
        bunnyStatus: { lt: result.Status }
      },
      data: {
        bunnyStatus: result.Status,
        duration: videoPlayData.video.length
      },
      include: {
        meme: {
          include: {
            video: true,
            categories: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })

    if (meme) {
      await algoliaClient
        .partialUpdateObject({
          indexName: algoliaIndexName,
          objectID: meme.id,
          attributesToUpdate: memeToAlgoliaRecord(meme)
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
    }

    return Response.json({ success: true })
  }
})
