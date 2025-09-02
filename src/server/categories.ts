import { z } from 'zod'
import { CACHE_KEYS } from '@/constants/db-cache'
import { prismaClient } from '@/db'
import { adminRequiredMiddleware } from '@/server/user-auth'
import { createServerFn } from '@tanstack/react-start'

export const CATEGORY_FORM_SCHEMA = z.object({
  title: z.string().min(3),
  slug: z.string().min(2),
  keywords: z.array(z.string())
})

export const getCategories = createServerFn({ method: 'GET' }).handler(
  async () => {
    const categories = await prismaClient.category.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      cacheStrategy: {
        ttl: process.env.NODE_ENV === 'production' ? 24 * 60 * 60 : 0,
        tags: CACHE_KEYS.categories
      }
    })

    return categories
  }
)

export const addCategory = createServerFn({ method: 'POST' })
  .middleware([adminRequiredMiddleware])
  .validator((data) => {
    return CATEGORY_FORM_SCHEMA.parse(data)
  })
  .handler(async ({ data }) => {
    const category = await prismaClient.category.create({ data })

    return category
  })

export const editCategory = createServerFn({ method: 'POST' })
  .middleware([adminRequiredMiddleware])
  .validator((data) => {
    return CATEGORY_FORM_SCHEMA.extend({
      id: z.string()
    }).parse(data)
  })
  .handler(async ({ data }) => {
    const category = await prismaClient.category.update({
      where: {
        id: data.id
      },
      data
    })

    return category
  })

export const deleteCategory = createServerFn({ method: 'POST' })
  .middleware([adminRequiredMiddleware])
  .validator((data) => {
    return z.string().parse(data)
  })
  .handler(async ({ data: categoryId }) => {
    const category = await prismaClient.category.delete({
      where: {
        id: categoryId
      }
    })

    return category
  })
