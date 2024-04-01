'use server'

import { z } from 'zod'
import prisma from '@/db'

const tweetbinderSchema = z.object({
  statusId: z.coerce.number(),
  url: z.string(),
  videos: z.array(
    z.object({
      bitrate: z.coerce.number(),
      endpoint: z.string(),
      quality: z.string().transform((value) => {
        return value.replace('avc1/', '')
      }),
      size: z.coerce.number(),
      type: z.string(),
      url: z.string()
    })
  )
})

const schemaTwitterLink = z
  .string()
  .regex(/^https:\/\/twitter\.com\/([A-Za-z0-9_]+)\/status\/(\d+)/)
  .transform((link) => {
    const matchId = link.match(
      /^https:\/\/twitter\.com\/([A-Za-z0-9_]+)\/status\/(\d+)/
    ) as RegExpMatchArray

    return matchId.at(2) as string
  })

export type FormStateValue =
  | {
      success: false
      errorMessage: string
    }
  | {
      data: z.infer<typeof tweetbinderSchema>['videos']
      success: true
    }
  | null

export async function extractTwitterLink(
  prevState: FormStateValue,
  formData: FormData
): Promise<FormStateValue> {
  try {
    const safeParsedResult = schemaTwitterLink.safeParse(formData.get('link'))

    if (!safeParsedResult.success) {
      return {
        success: false,
        errorMessage: 'URL is not a valid X link'
      }
    }

    const response = (await Promise.race([
      fetch(
        `https://pub.tweetbinder.com:51026/twitter/status/${safeParsedResult.data}`
      ),
      new Promise((resolve, reject) => {
        return setTimeout(reject, 5000)
      })
    ])) as Response

    const json = await response.json()

    const data = tweetbinderSchema.parse(json)
    const video = data.videos.at(-1)!

    await prisma.meme.create({
      data: {
        title: data.url,
        videoUrl: video.url
      }
    })

    return {
      success: true,
      data: data.videos
    }
  } catch (error) {
    return {
      success: false,
      errorMessage: 'An unknown error occurred'
    }
  }
}
