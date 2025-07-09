import type { MemesFilters } from '@/constants/meme'
import { getAuthUser } from '@/server/auth'
import { getMemeById, getMemes } from '@/server/meme'
import type { Meme } from '@prisma/client'
import { queryOptions } from '@tanstack/react-query'

export const getMemesListQueryOpts = (filters: MemesFilters) => {
  return queryOptions({
    queryKey: ['memes-list', filters],
    queryFn: async () => {
      return getMemes({ data: filters })
    }
  })
}

export const getMemeByIdQueryOpts = (memeId: Meme['id']) => {
  return queryOptions({
    queryKey: ['meme', memeId],
    queryFn: async () => {
      return getMemeById({ data: memeId })
    }
  })
}

export const getAuthUserQueryOpts = () => {
  return queryOptions({
    queryKey: ['auth-user'],
    queryFn: async () => {
      return getAuthUser()
    }
  })
}
