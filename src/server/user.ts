import type { User } from 'better-auth'
import { z } from 'zod'
import { StudioError } from '@/constants/error'
import { FREE_PLAN } from '@/constants/plan'
import { prismaClient } from '@/db'
import { getActiveSubscription } from '@/server/customer'
import { authUserRequiredMiddleware } from '@/server/user-auth'
import type { Meme } from '@prisma/client'
import { notFound } from '@tanstack/react-router'
import { createServerFn, serverOnly } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'

export const getFavoritesMemes = createServerFn({ method: 'GET' })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ context }) => {
    const activeSubscription = await getActiveSubscription()

    const bookmarks = await prismaClient.userBookmark.findMany({
      where: {
        userId: context.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: activeSubscription ? undefined : FREE_PLAN.maxFavoritesCount,
      include: {
        meme: {
          include: {
            video: true
          }
        }
      }
    })

    return {
      bookmarks: bookmarks.map((bookmark) => {
        return bookmark.meme
      }),
      count: bookmarks.length
    }
  })

export const checkGeneration = createServerFn({ method: 'POST' })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ context }) => {
    const { generationCount } = await prismaClient.user.findUniqueOrThrow({
      where: {
        id: context.user.id
      },
      select: {
        generationCount: true
      }
    })

    const activeSubscription = await getActiveSubscription()

    if (
      generationCount >= FREE_PLAN.maxGenerationsCount &&
      !activeSubscription
    ) {
      setResponseStatus(403)
      throw new StudioError('PREMIUM_REQUIRED')
    }

    return { result: 'ok' } as const
  })

const toggleBookmark = serverOnly(
  async (userId: User['id'], memeId: Meme['id']) => {
    const bookmark = await prismaClient.userBookmark.findUnique({
      // eslint-disable-next-line camelcase
      where: { userId_memeId: { userId, memeId } }
    })

    if (bookmark) {
      await prismaClient.userBookmark.delete({
        // eslint-disable-next-line camelcase
        where: { userId_memeId: { userId, memeId } }
      })

      return { bookmarked: false }
    }

    const totalBookmarks = await prismaClient.userBookmark.count({
      where: { userId }
    })

    if (totalBookmarks >= FREE_PLAN.maxFavoritesCount) {
      const activeSubscription = await getActiveSubscription()

      if (!activeSubscription) {
        setResponseStatus(403)
        throw new StudioError('PREMIUM_REQUIRED')
      }
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

export const incrementGenerationCount = createServerFn({ method: 'POST' })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ context }) => {
    await prismaClient.user.update({
      where: {
        id: context.user.id
      },
      data: {
        generationCount: {
          increment: 1
        }
      }
    })

    return { result: 'ok' } as const
  })
