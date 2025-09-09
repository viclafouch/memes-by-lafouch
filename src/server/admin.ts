import { filesize } from 'filesize'
import { z } from 'zod'
import type { MemeWithCategories, MemeWithVideo } from '@/constants/meme'
import {
  MAX_SIZE_MEME_IN_BYTES,
  MEMES_FILTERS_SCHEMA,
  MemeStatusFixed,
  TWEET_LINK_SCHEMA
} from '@/constants/meme'
import { prismaClient } from '@/db'
import {
  algoliaClient,
  algoliaIndexName,
  memeToAlgoliaRecord
} from '@/lib/algolia'
import { auth } from '@/lib/auth'
import { createVideo, deleteVideo, uploadVideo } from '@/lib/bunny'
import {
  extractTweetIdFromUrl,
  getTweetById,
  getTweetMedia
} from '@/lib/react-tweet'
import { adminRequiredMiddleware } from '@/server/user-auth'
import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'

export const getListUsers = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { headers } = getWebRequest()

    const listUsers = await auth.api.listUsers({
      query: {
        limit: 100,
        offset: 0,
        sortBy: 'createdAt'
      },
      headers
    })

    return listUsers
  }
)

export const MEME_FORM_SCHEMA = z.object({
  title: z.string().min(3),
  keywords: z.array(z.string()),
  categoryIds: z.array(z.string()),
  status: z.enum(MemeStatusFixed),
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
    return MEME_FORM_SCHEMA.extend({ id: z.string() }).parse(data)
  })
  .middleware([adminRequiredMiddleware])
  .handler(async ({ data: values }) => {
    const meme = await prismaClient.meme.findUnique({
      where: {
        id: values.id
      },
      include: {
        video: true
      }
    })

    if (!meme) {
      throw new Error('Meme not found')
    }

    const memeUpdated = await prismaClient.meme.update({
      where: {
        id: values.id
      },
      data: {
        title: values.title,
        status: values.status,
        categories: {
          deleteMany: {},
          create: values.categoryIds.map((categoryId) => {
            return {
              category: {
                connect: { id: categoryId }
              }
            }
          })
        },
        keywords: values.keywords.map((keyword) => {
          return keyword.toLowerCase().trim()
        }),
        tweetUrl: values.tweetUrl || null
      },
      include: {
        video: true,
        categories: {
          include: { category: true }
        }
      }
    })

    await algoliaClient
      .partialUpdateObject({
        indexName: algoliaIndexName,
        objectID: meme.id,
        attributesToUpdate: memeToAlgoliaRecord(memeUpdated)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })

    return { id: memeUpdated.id }
  })

export const deleteMemeById = createServerFn({ method: 'POST' })
  .validator((data) => {
    return z.string().parse(data)
  })
  .middleware([adminRequiredMiddleware])
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

    await algoliaClient
      .deleteObject({
        indexName: algoliaIndexName,
        objectID: meme.id
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })

    await deleteVideo(meme.video.bunnyId)

    return { id: meme.id }
  })

export const createMemeFromTwitterUrl = createServerFn({ method: 'POST' })
  .validator((url: string) => {
    return TWEET_LINK_SCHEMA.parse(url)
  })
  .middleware([adminRequiredMiddleware])
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
        status: 'PENDING',
        video: {
          create: {
            duration: 0,
            bunnyId: videoId
          }
        }
      },
      include: {
        video: true,
        categories: {
          include: { category: true }
        }
      }
    })

    await algoliaClient
      .saveObject({
        indexName: algoliaIndexName,
        body: memeToAlgoliaRecord(meme)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
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
  .middleware([adminRequiredMiddleware])
  .handler(async ({ data: values }) => {
    const title = 'Sans titre'
    const arrayBuffer = await values.video.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { videoId } = await createVideo(title)

    const meme = await prismaClient.meme.create({
      data: {
        title,
        tweetUrl: '',
        status: 'PENDING',
        video: {
          create: {
            duration: 0,
            bunnyId: videoId
          }
        }
      },
      include: {
        video: true,
        categories: {
          include: { category: true }
        }
      }
    })

    await uploadVideo(videoId, buffer)

    await algoliaClient
      .saveObject({
        indexName: algoliaIndexName,
        body: memeToAlgoliaRecord(meme)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })

    return {
      id: meme.id
    }
  })

export const getAdminMemes = createServerFn({ method: 'GET' })
  .middleware([adminRequiredMiddleware])
  .validator(MEMES_FILTERS_SCHEMA)
  .handler(async ({ data }) => {
    const response = await algoliaClient.searchSingleIndex<
      MemeWithVideo & MemeWithCategories
    >({
      indexName: algoliaIndexName,
      searchParams: {
        query: data.query,
        page: data.page ? data.page - 1 : 0,
        hitsPerPage: 30,
        filters: (() => {
          const filters: string[] = []

          if (data.status) {
            filters.push(`status:${data.status}`)
          }

          return filters.length ? filters.join(' AND ') : undefined
        })()
      }
    })

    return {
      memes: response.hits as (MemeWithVideo & MemeWithCategories)[],
      query: data.query,
      page: response.page,
      totalPages: response.nbPages
    }
  })
