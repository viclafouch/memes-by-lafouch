/* eslint-disable camelcase */
import { filesize } from 'filesize'
import { z } from 'zod'
import {
  MAX_SIZE_MEME_IN_BYTES,
  MEMES_FILTERS_SCHEMA,
  TWEET_LINK_SCHEMA
} from '@/constants/meme'
import { prismaClient } from '@/db'
import {
  createVideo,
  deleteVideo,
  getVideoPlayData,
  uploadVideo
} from '@/lib/bunny'
import { authUserRequiredMiddleware } from '@/server/auth'
import {
  extractTweetIdFromUrl,
  getTweetById,
  getTweetMedia
} from '@/utils/tweet'
import type { Meme, User } from '@prisma/client'
import { notFound } from '@tanstack/react-router'
import { createServerFn, serverOnly } from '@tanstack/react-start'

export const getMemeById = createServerFn({ method: 'GET' })
  .validator((data) => {
    return z.string().parse(data)
  })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data: memeId }) => {
    const meme = await prismaClient.meme.findUnique({
      where: {
        id: memeId
      },
      include: {
        video: true
      }
    })

    if (!meme) {
      throw notFound()
    }

    return meme
  })

const toggleBookmark = serverOnly(
  async (userId: User['id'], memeId: Meme['id']) => {
    const bookmark = await prismaClient.userBookmark.findUnique({
      where: { userId_memeId: { userId, memeId } }
    })

    if (bookmark) {
      await prismaClient.userBookmark.delete({
        where: { userId_memeId: { userId, memeId } }
      })

      return { bookmarked: false }
    }

    await prismaClient.userBookmark.create({
      data: { userId, memeId }
    })

    return { bookmarked: true }
  }
)

export const toggleBookmarkByMemeId = createServerFn({ method: 'POST' })
  .validator((data) => {
    return z.string().parse(data)
  })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data: memeId, context }) => {
    const meme = await prismaClient.meme.findUnique({
      where: {
        id: memeId
      }
    })

    if (!meme) {
      throw notFound()
    }

    const { bookmarked } = await toggleBookmark(context.user.id, memeId)

    return { bookmarked }
  })

export const getVideoStatusById = createServerFn({ method: 'GET' })
  .validator((data) => {
    return z.number().parse(data)
  })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data: videoId }) => {
    const video = await prismaClient.video.findUnique({
      where: {
        id: videoId
      }
    })

    if (!video) {
      throw notFound()
    }

    return {
      status: video.bunnyStatus
    }
  })

export const getMemes = createServerFn({ method: 'GET' })
  .validator(MEMES_FILTERS_SCHEMA)
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data, context }) => {
    // page starts at 1 in UI, 0 in API
    const page = (data.page ?? 1) - 1
    const skip = page * 30
    const dataQueryNormalized = data.query?.toLowerCase().trim() ?? ''

    const filters = dataQueryNormalized
      ? {
          OR: [
            {
              title: {
                search: dataQueryNormalized.split(' ').join(' & ')
              }
            },
            {
              keywords: {
                hasSome: dataQueryNormalized.split(' ')
              }
            }
          ]
        }
      : undefined

    const totalMemes = await prismaClient.meme.count({ where: filters })

    const memes = await prismaClient.meme.findMany({
      take: 30,
      skip,
      include: {
        video: true,
        bookmarkedBy: {
          where: { userId: context.user.id },
          select: { id: true }
        }
      },
      orderBy: {
        createdAt: data.orderBy === 'most_old' ? 'asc' : 'desc'
      },
      where: filters
    })

    const memesWithIsBookmarked = memes.map(({ bookmarkedBy, ...meme }) => {
      return {
        ...meme,
        isBookmarked: bookmarkedBy.length > 0
      }
    })

    return {
      memes: memesWithIsBookmarked,
      query: data.query,
      currentPage: page + 1,
      totalPages: Math.ceil(totalMemes / 30)
    }
  })

export const getRandomMeme = createServerFn({ method: 'GET' })
  .validator((data) => {
    return z.string().optional().parse(data)
  })
  .handler(async ({ data: exceptId }) => {
    const memes = await prismaClient.meme.findMany({
      include: {
        video: true
      }
    })

    const withoutCurrentMeme = memes.filter((meme) => {
      return meme.id !== exceptId
    })

    const randomIndex = Math.floor(Math.random() * withoutCurrentMeme.length)

    return withoutCurrentMeme[randomIndex]
  })

export const EDIT_MEME_SCHEMA = z.object({
  title: z.string().min(3),
  keywords: z.array(z.string()),
  tweetUrl: TWEET_LINK_SCHEMA.nullable().or(
    z
      .string()
      .length(0)
      .transform(() => {
        return null
      })
  )
})

export const editMeme = createServerFn({ method: 'POST' })
  .validator((data) => {
    return EDIT_MEME_SCHEMA.extend({ memeId: z.string() }).parse(data)
  })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data: values }) => {
    const meme = await prismaClient.meme.findUnique({
      where: {
        id: values.memeId
      },
      include: {
        video: true
      }
    })

    if (!meme) {
      throw new Error('Meme not found')
    }

    await prismaClient.meme.update({
      where: {
        id: values.memeId
      },
      data: {
        title: values.title,
        keywords: values.keywords.map((keyword) => {
          return keyword.toLowerCase().trim()
        }),
        tweetUrl: values.tweetUrl || null
      },
      include: {
        video: true
      }
    })

    return { id: meme.id }
  })

export const deleteMemeById = createServerFn({ method: 'POST' })
  .validator((data) => {
    return z.string().parse(data)
  })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data: memeId }) => {
    const meme = await prismaClient.meme.delete({
      where: {
        id: memeId
      },
      include: {
        video: true
      }
    })

    await prismaClient.video.delete({
      where: {
        id: meme.videoId
      }
    })

    await deleteVideo(meme.video.bunnyId)

    return { id: meme.id }
  })

export const createMemeFromTwitterUrl = createServerFn({ method: 'POST' })
  .validator((url: string) => {
    return TWEET_LINK_SCHEMA.parse(url)
  })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data: url }) => {
    const tweetId = z.string().parse(extractTweetIdFromUrl(url))

    const tweet = await getTweetById(tweetId)
    const media = await getTweetMedia(tweet.video.url, tweet.poster.url)

    if (media.video.blob.size > MAX_SIZE_MEME_IN_BYTES) {
      throw new Error(
        `Video size is too big: ${filesize(media.video.blob.size)}`
      )
    }

    const title = 'Sans titre'
    const arrayBuffer = await media.video.blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { videoId } = await createVideo(title)

    const meme = await prismaClient.meme.create({
      data: {
        title,
        tweetUrl: tweet.url,
        video: {
          create: {
            bunnyId: videoId
          }
        }
      }
    })

    await uploadVideo(videoId, buffer)

    return {
      id: meme.id
    }
  })

export const CREATE_MEME_FROM_FILE_SCHEMA = z.object({
  video: z.file().min(1).max(MAX_SIZE_MEME_IN_BYTES).mime('video/mp4')
})

export const createMemeFromFile = createServerFn({ method: 'POST' })
  .validator((data) => {
    const formData = z.instanceof(FormData).parse(data)

    return CREATE_MEME_FROM_FILE_SCHEMA.parse({
      video: formData.get('video')
    })
  })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data: values }) => {
    const title = 'Sans titre'
    const arrayBuffer = await values.video.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { videoId } = await createVideo(title)

    const meme = await prismaClient.meme.create({
      data: {
        title,
        tweetUrl: '',
        video: {
          create: {
            bunnyId: videoId
          }
        }
      }
    })

    await uploadVideo(videoId, buffer)

    return {
      id: meme.id
    }
  })

export const shareMeme = createServerFn({ method: 'GET', response: 'raw' })
  .validator((data) => {
    return z.string().parse(data)
  })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data: memeId }) => {
    const meme = await prismaClient.meme.findUnique({
      where: {
        id: memeId
      },
      include: {
        video: true
      }
    })

    if (!meme) {
      throw notFound()
    }

    const { originalUrl } = await getVideoPlayData(meme.video.bunnyId)

    const response = await fetch(originalUrl)
    const blob = await response.blob()

    return new Response(blob, {
      headers: {
        'Content-Type': blob.type,
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    })
  })
