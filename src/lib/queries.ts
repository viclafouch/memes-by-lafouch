import type { MemesFilters } from '@/constants/meme'
import { getBestMemes } from '@/server/ai'
import { getCategories } from '@/server/categories'
import { getMemeById, getMemes, getVideoStatusById } from '@/server/meme'
import { getFavoritesMemes, getFavoritesMemesCount } from '@/server/user'
import { getAuthUser } from '@/server/user-auth'
import type { Meme, Video } from '@prisma/client'
import { queryOptions } from '@tanstack/react-query'

export const getMemesListQueryOpts = (filters: MemesFilters) => {
  return queryOptions({
    queryKey: [...getMemesListQueryOpts.all, filters],
    queryFn: async () => {
      return getMemes({ data: filters })
    }
  })
}

getMemesListQueryOpts.all = ['memes-list'] as const

export const getBestMemesQueryOpts = () => {
  return queryOptions({
    queryKey: [...getBestMemesQueryOpts.all],
    queryFn: async () => {
      return getBestMemes()
    }
  })
}

getBestMemesQueryOpts.all = ['best-memes'] as const

export const getMemeByIdQueryOpts = (memeId: Meme['id']) => {
  return queryOptions({
    queryKey: [...getMemeByIdQueryOpts.all, memeId],
    queryFn: async () => {
      return getMemeById({ data: memeId })
    }
  })
}

getMemeByIdQueryOpts.all = ['meme'] as const

export const getVideoStatusByIdQueryOpts = (videoId: Video['id']) => {
  return queryOptions({
    queryKey: [...getVideoStatusByIdQueryOpts.all, videoId],
    queryFn: async () => {
      return getVideoStatusById({ data: videoId })
    }
  })
}

getVideoStatusByIdQueryOpts.all = ['video-status'] as const

export const getAuthUserQueryOpts = () => {
  return queryOptions({
    queryKey: [...getAuthUserQueryOpts.all],
    queryFn: async () => {
      return getAuthUser()
    }
  })
}

getAuthUserQueryOpts.all = ['auth-user'] as const

export const getFavoritesMemesCountQueryOpts = () => {
  return queryOptions({
    queryKey: [...getFavoritesMemesCountQueryOpts.all],
    queryFn: async () => {
      return getFavoritesMemesCount()
    }
  })
}

getFavoritesMemesCountQueryOpts.all = ['favorites-memes-count'] as const

export const getFavoritesMemesQueryOpts = () => {
  return queryOptions({
    queryKey: [...getFavoritesMemesQueryOpts.all],
    queryFn: async () => {
      return getFavoritesMemes()
    }
  })
}

getFavoritesMemesQueryOpts.all = ['favorites-memes'] as const

export const getCategoriesListQueryOpts = () => {
  return queryOptions({
    queryKey: [...getCategoriesListQueryOpts.all],
    queryFn: async () => {
      return getCategories()
    }
  })
}

getCategoriesListQueryOpts.all = ['categories-list'] as const
