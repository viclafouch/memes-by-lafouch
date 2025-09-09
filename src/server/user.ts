import { StudioError } from '@/constants/error'
import { prismaClient } from '@/db'
import { getActiveSubscription } from '@/server/customer'
import { authUserRequiredMiddleware } from '@/server/user-auth'
import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'

export const getFavoritesMemesCount = createServerFn({ method: 'GET' })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ context }) => {
    const count = await prismaClient.userBookmark.count({
      where: {
        userId: context.user.id
      }
    })

    return { count }
  })

export const getFavoritesMemes = createServerFn({ method: 'GET' })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ context }) => {
    const bookmarks = await prismaClient.userBookmark.findMany({
      where: {
        userId: context.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        meme: {
          include: {
            video: true
          }
        }
      }
    })

    return bookmarks.map((bookmark) => {
      return bookmark.meme
    })
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

    if (generationCount >= 1 && !activeSubscription) {
      setResponseStatus(403)
      throw new StudioError('PREMIUM_REQUIRED')
    }

    return { result: 'ok' } as const
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
