/* eslint-disable camelcase */
import { z } from 'zod'
import type { MemeWithVideo } from '@/constants/meme'
import { MEMES_FILTERS_SCHEMA } from '@/constants/meme'
import { prismaClient } from '@/db'
import { getVideoPlayData } from '@/lib/bunny'
import { authUserRequiredMiddleware } from '@/server/user-auth'
import { searchClient } from '@algolia/client-search'
import type { Meme, User } from '@prisma/client'
import { notFound } from '@tanstack/react-router'
import { createServerFn, serverOnly } from '@tanstack/react-start'

const appID = 'W4S6H0K8DZ'
const apiKey = 'df745aae70b47dcff698517eddfbf684'
const indexName = 'backup'

const client = searchClient(appID, apiKey)

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
        bookmarkedBy: true,
        video: true
      }
    })

    if (!meme) {
      throw notFound()
    }

    const { bookmarkedBy, ...memeWithoutBookmarkedBy } = meme

    return {
      ...memeWithoutBookmarkedBy,
      isBookmarked: false
    }
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
    const response = await client.searchSingleIndex<MemeWithVideo>({
      indexName,
      searchParams: {
        query: data.query,
        page: data.page ? data.page - 1 : 0,
        hitsPerPage: 30
      }
    })

    return {
      memes: response.hits as MemeWithVideo[],
      query: data.query,
      page: response.page,
      totalPages: response.nbPages
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
