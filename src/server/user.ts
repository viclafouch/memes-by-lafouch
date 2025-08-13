import { prismaClient } from '@/db'
import { authUserRequiredMiddleware } from '@/server/user-auth'
import { createServerFn } from '@tanstack/react-start'

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
