import { prismaClient } from '@/db'
import { authUserRequiredMiddleware } from '@/server/auth'
import { createServerFn } from '@tanstack/react-start'

export const getFavoritesMemesCount = createServerFn({ method: 'GET' })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ context }) => {
    const count = await prismaClient.meme.count({
      where: {
        bookmarkedBy: {
          some: {
            userId: context.user.id
          }
        }
      }
    })

    return { count }
  })

export const getFavoritesMemes = createServerFn({ method: 'GET' })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ context }) => {
    const userId = context.user.id

    const userBookmarks = await prismaClient.userBookmark.findMany({
      where: {
        userId
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

    return userBookmarks.map(({ meme }) => {
      return {
        ...meme,
        isBookmarked: true
      }
    })
  })
