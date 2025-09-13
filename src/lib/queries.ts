import type { MemesFilters } from '@/constants/meme'
import { getAdminMemes } from '@/server/admin'
import { getCategories } from '@/server/categories'
import { getActiveSubscription } from '@/server/customer'
import {
  getBestMemes,
  getMemeById,
  getMemes,
  getRecentCountMemes,
  getVideoStatusById
} from '@/server/meme'
import { getInfiniteReels } from '@/server/reels'
import { getFavoritesMemes } from '@/server/user'
import { getAuthUser } from '@/server/user-auth'
import type { Meme, Video } from '@prisma/client'
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'

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

export const getFavoritesMemesQueryOpts = () => {
  return queryOptions({
    queryKey: [...getFavoritesMemesQueryOpts.all],
    queryFn: async () => {
      return getFavoritesMemes()
    },
    staleTime: 1000 * 60 * 5 // 5min
  })
}

getFavoritesMemesQueryOpts.all = ['favorites-memes'] as const

export const getCategoriesListQueryOpts = () => {
  return queryOptions({
    queryKey: [...getCategoriesListQueryOpts.all],
    queryFn: async () => {
      return getCategories()
    },
    staleTime: 1000 * 60 * 10, // 10min
    select: (categories) => {
      return [...categories].sort((categoryA, categoryB) => {
        if (categoryA.slug === 'news') {
          return -1
        }

        if (categoryB.slug === 'news') {
          return 1
        }

        return 0
      })
    }
  })
}

getCategoriesListQueryOpts.all = ['categories-list'] as const

export const getRecentCountMemesQueryOpts = () => {
  return queryOptions({
    queryKey: [...getRecentCountMemesQueryOpts.all],
    queryFn: async () => {
      return getRecentCountMemes()
    },
    staleTime: 1000 * 60 * 10 // 10min
  })
}

getRecentCountMemesQueryOpts.all = ['recent-count-memes'] as const

export const getAdminMemesListQueryOpts = (filters: MemesFilters) => {
  return queryOptions({
    queryKey: [...getAdminMemesListQueryOpts.all, filters],
    queryFn: async () => {
      return getAdminMemes({ data: filters })
    }
  })
}

getAdminMemesListQueryOpts.all = ['admin-memes-list'] as const

export const getActiveSubscriptionQueryOpts = () => {
  return queryOptions({
    queryKey: [...getActiveSubscriptionQueryOpts.all],
    queryFn: async () => {
      return getActiveSubscription()
    }
  })
}

getActiveSubscriptionQueryOpts.all = ['active-subscription'] as const

export const getInfiniteReelsQueryOpts = (excludedIds: string[] = []) => {
  return infiniteQueryOptions({
    queryKey: [...getInfiniteReelsQueryOpts.all],
    queryFn: ({ pageParam }) => {
      return getInfiniteReels({
        data: {
          excludedIds: pageParam
        }
      })
    },
    initialPageParam: excludedIds,
    getNextPageParam: (lastPage) => {
      return lastPage.excludedIds
    }
  })
}

getInfiniteReelsQueryOpts.all = ['infinite-reels'] as const
