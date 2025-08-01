import type { MemesFilters } from '@/constants/meme'
import { getBestMemes } from '@/server/ai'
import { getAuthUser } from '@/server/auth'
import { getMemeById, getMemes, getVideoStatusById } from '@/server/meme'
import { getFavoritesMemesCount } from '@/server/user'
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

export const getBestMemesQueryOpts = (query: string) => {
  return queryOptions({
    queryKey: [...getBestMemesQueryOpts.all, query],
    queryFn: async () => {
      return getBestMemes({ data: query })
    }
  })
}

getBestMemesQueryOpts.all = ['best-memes'] as const

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
