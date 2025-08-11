import React from 'react'
import { Star } from 'lucide-react'
import { IconButton } from '@/components/animate-ui/buttons/icon'
import {
  getFavoritesMemesCountQueryOpts,
  getMemeByIdQueryOpts,
  getMemesListQueryOpts
} from '@/lib/queries'
import type { getMemes } from '@/server/meme'
import { toggleBookmarkByMemeId } from '@/server/meme'
import type { Meme } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

type ToggleLikeButtonProps = {
  meme: Meme & { isBookmarked: boolean }
  className?: string
}

const ToggleLikeButton = ({ meme, className }: ToggleLikeButtonProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const toggleLikeMutation = useMutation({
    mutationFn: toggleBookmarkByMemeId,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: getMemesListQueryOpts.all,
        exact: false
      })

      await queryClient.setQueryData(
        getFavoritesMemesCountQueryOpts().queryKey,
        (old) => {
          if (old) {
            return {
              ...old,
              count: old.count + (meme.isBookmarked ? -1 : 1)
            }
          }

          return undefined
        }
      )

      await queryClient.setQueryData(
        getMemeByIdQueryOpts(meme.id).queryKey,
        (old) => {
          if (old) {
            return {
              ...old,
              isBookmarked: !meme.isBookmarked
            }
          }

          return undefined
        }
      )

      type Data = Awaited<ReturnType<typeof getMemes>>

      const queries = queryClient.getQueriesData<Data>({
        queryKey: getMemesListQueryOpts.all,
        exact: false
      })

      for (const query of queries) {
        queryClient.setQueryData(query[0], (old: Data) => {
          return {
            ...old,
            memes: old.memes.map((memeItem) => {
              return memeItem.id === meme.id
                ? {
                    ...memeItem,
                    isBookmarked: !meme.isBookmarked
                  }
                : memeItem
            })
          }
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(getFavoritesMemesCountQueryOpts())
      queryClient.invalidateQueries(getMemeByIdQueryOpts(meme.id))
      router.invalidate({
        filter: (route) => {
          return route.routeId === '/_auth/favorites'
        }
      })
    }
  })

  const handleToggleLike = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    toggleLikeMutation.mutate({
      data: meme.id
    })
  }

  return (
    <IconButton
      icon={Star}
      active={meme.isBookmarked}
      className={className}
      onClick={handleToggleLike}
    />
  )
}

export default ToggleLikeButton
