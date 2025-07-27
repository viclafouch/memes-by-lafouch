import { z } from 'zod'
import { prismaClient } from '@/db'
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

    await prismaClient.video
      .update({
        where: {
          bunnyId: result.VideoGuid,
          bunnyStatus: { lt: result.Status }
        },
        data: {
          bunnyStatus: result.Status
        }
      })
      .catch(() => {})

    return Response.json({ success: true })
  }
})
