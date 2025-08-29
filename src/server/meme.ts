/* eslint-disable camelcase */
import { z } from 'zod'
import type { MemeWithVideo } from '@/constants/meme'
import { MEMES_FILTERS_SCHEMA } from '@/constants/meme'
import { prismaClient } from '@/db'
import { algoliaClient, algoliaIndexName } from '@/lib/algolia'
import { getVideoPlayData } from '@/lib/bunny'
import { authUserRequiredMiddleware } from '@/server/user-auth'
import type { Meme, User } from '@prisma/client'
import { notFound } from '@tanstack/react-router'
import { createServerFn, serverOnly } from '@tanstack/react-start'

export const getMemeById = createServerFn({ method: 'GET' })
  .validator((data) => {
    return z.string().parse(data)
  })
  .handler(async ({ data: memeId }) => {
    const meme = await prismaClient.meme.findUnique({
      where: {
        id: memeId
      },
      include: {
        video: true,
        categories: {
          include: { category: true }
        }
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
  .handler(async ({ data }) => {
    const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1000

    const response = await algoliaClient.searchSingleIndex<MemeWithVideo>({
      indexName: algoliaIndexName,
      searchParams: {
        query: data.query,
        page: data.page ? data.page - 1 : 0,
        hitsPerPage: 30,
        filters: (() => {
          if (!data.categories?.length) {
            return undefined
          }

          const hasNews = data.categories.includes('news')

          const otherCategories = data.categories.filter((slug) => {
            return slug !== 'news'
          })

          const newsFilter = hasNews
            ? `createdAtTime >= ${THIRTY_DAYS_AGO}`
            : null

          const categoryFilter = otherCategories.length
            ? otherCategories
                .map((slug) => {
                  return `categorySlugs:${slug}`
                })
                .join(' AND ')
            : null

          if (newsFilter && categoryFilter) {
            return `(${newsFilter}) AND (${categoryFilter})`
          }

          if (newsFilter) {
            return newsFilter
          }

          if (categoryFilter) {
            return categoryFilter
          }

          return undefined
        })()
      }
    })

    return {
      memes: response.hits as MemeWithVideo[],
      query: data.query,
      page: response.page,
      totalPages: response.nbPages
    }
  })

export const getRecentCountMemes = createServerFn({ method: 'GET' }).handler(
  async () => {
    const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1000

    const countResult = await algoliaClient.searchSingleIndex({
      indexName: algoliaIndexName,
      searchParams: {
        filters: `createdAtTime >= ${THIRTY_DAYS_AGO}`,
        hitsPerPage: 0
      }
    })

    return countResult.nbHits ?? 0
  }
)

export const getBestMemes = createServerFn({ method: 'GET' }).handler(
  async () => {
    const memes = await prismaClient.meme.findMany({
      take: 12,
      include: {
        video: true
      },
      orderBy: {
        viewCount: 'desc'
      },
      cacheStrategy: {
        ttl: 24 * 60 * 60
      }
    })

    return memes
  }
)

export const getRandomMeme = createServerFn({ method: 'GET' })
  .validator((data) => {
    return z.string().optional().parse(data)
  })
  .handler(async ({ data: exceptId }) => {
    const memes = await prismaClient.meme.findMany({
      include: {
        video: true
      },
      cacheStrategy: { ttl: 24 * 60 * 60 }
    })

    const withoutCurrentMeme = memes.filter((meme) => {
      return meme.id !== exceptId
    })

    const randomIndex = Math.floor(Math.random() * withoutCurrentMeme.length)

    return withoutCurrentMeme[randomIndex]
  })

export const shareMeme = createServerFn({ method: 'GET', response: 'raw' })
  .validator((data) => {
    return z.string().parse(data)
  })
  .handler(async ({ data: memeId }) => {
    const meme = await prismaClient.meme.findUnique({
      where: {
        id: memeId
      },
      include: {
        video: true
      },
      cacheStrategy: { ttl: 24 * 60 * 60 }
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
