import { prismaClient } from '@/db'
import { authUserRequiredMiddleware } from '@/server/auth'
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
    const userBookmarks = await prismaClient.userBookmark.findMany({
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

    return userBookmarks.map(({ meme }) => {
      return {
        ...meme,
        isBookmarked: true
      }
    })
  })

export const getUsers = createServerFn({ method: 'GET' })
  .middleware([authUserRequiredMiddleware])
  .handler(async () => {
    const users = await prismaClient.user.findMany({
      include: {
        bookmarks: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return users
  })
