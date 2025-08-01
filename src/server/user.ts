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

    const memes = await prismaClient.meme.findMany({
      where: {
        bookmarkedBy: {
          some: {
            userId
          }
        }
      },
      include: {
        bookmarkedBy: true,
        video: true
      }
    })

    const memesWithIsBookmarked = memes.map(({ bookmarkedBy, ...meme }) => {
      return {
        ...meme,
        isBookmarked: bookmarkedBy.length > 0
      }
    })

    return memesWithIsBookmarked
  })
