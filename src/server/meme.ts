import { filesize } from 'filesize'
import { z } from 'zod/v4'
import {
  MAX_SIZE_MEME_IN_BYTES,
  MEMES_FILTERS_SCHEMA,
  TWEET_LINK_SCHEMA
} from '@/constants/meme'
import { prismaClient } from '@/db'
import { authUserRequiredMiddleware } from '@/server/auth'
import { utapi } from '@/uploadthing'
import { wait } from '@/utils/promise'
import {
  extractTweetIdFromUrl,
  getTweetById,
  getTweetMedia
} from '@/utils/tweet'
import { createServerFn } from '@tanstack/react-start'

export const getMemeById = createServerFn({ method: 'GET' })
  .validator((data) => {
    return z.string().parse(data)
  })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data: memeId }) => {
    return prismaClient.meme.findUnique({
      where: {
        id: memeId
      },
      include: {
        video: true
      }
    })
  })

export const getMemes = createServerFn({ method: 'GET' })
  .validator(MEMES_FILTERS_SCHEMA)
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data }) => {
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
        video: true
      },
      orderBy: {
        createdAt: data.orderBy === 'most_old' ? 'asc' : 'desc'
      },
      where: filters
    })

    return {
      memes,
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
    const meme = await prismaClient.meme.update({
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

    const deleteFilesResult = await utapi.deleteFiles(
      meme.video.posterUtKey
        ? [meme.video.posterUtKey, meme.video.videoUtKey]
        : meme.video.videoUtKey
    )

    if (!deleteFilesResult.success) {
      throw new Error('Failed to delete file')
    }

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

    const [videoFileResult, posterFileResult] = await utapi.uploadFiles([
      media.video.file,
      media.poster.file
    ])

    if (videoFileResult.error ?? posterFileResult.error) {
      throw new Error(
        videoFileResult.error?.message ?? posterFileResult.error?.message
      )
    }

    try {
      const meme = await prismaClient.meme.create({
        data: {
          title: 'Titre inconnu',
          tweetUrl: tweet.url,
          video: {
            create: {
              poster: posterFileResult.data.ufsUrl,
              posterUtKey: posterFileResult.data.key,
              src: videoFileResult.data.ufsUrl,
              videoUtKey: videoFileResult.data.key
            }
          }
        }
      })

      return {
        id: meme.id
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      // Looks like we have to wait a minimum of time before directly removing a file
      await wait(1000)
      // Remove files if something went wrong
      await utapi.deleteFiles([
        videoFileResult.data.key,
        posterFileResult.data.key
      ])

      throw new Error('An unknown error occurred')
    }
  })

export const incrementDownloadCount = createServerFn({ method: 'POST' })
  .validator((value) => {
    return z.string().parse(value)
  })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data: memeId }) => {
    const meme = await prismaClient.meme.update({
      where: {
        id: memeId
      },
      data: {
        downloadCount: {
          increment: 1
        }
      },
      select: {
        id: true,
        downloadCount: true
      }
    })

    return meme
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
    const uploadFileResult = await utapi.uploadFiles(values.video)

    if (uploadFileResult.error) {
      throw new Error(uploadFileResult.error.message)
    }

    try {
      const meme = await prismaClient.meme.create({
        data: {
          title: 'Titre inconnu',
          tweetUrl: '',
          video: {
            create: {
              videoUtKey: uploadFileResult.data.key,
              src: uploadFileResult.data.ufsUrl,
              poster: ''
            }
          }
        }
      })

      return {
        id: meme.id
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      // Looks like we have to wait a minimum of time before directly removing a file
      await wait(1000)
      // Remove files if something went wrong
      await utapi.deleteFiles([uploadFileResult.data.key])

      throw new Error('An unknown error occurred')
    }
  })
