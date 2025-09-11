import React from 'react'
import type { User } from 'better-auth'
import { Star } from 'lucide-react'
import { IconButton } from '@/components/animate-ui/buttons/icon'
import type { MemeWithVideo } from '@/constants/meme'
import { getFavoritesMemesQueryOpts, getMemeByIdQueryOpts } from '@/lib/queries'
import { toggleBookmarkByMemeId } from '@/server/user'
import { useShowDialog } from '@/stores/dialog.store'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'

type ToggleLikeButtonProps = {
  meme: MemeWithVideo
  className?: string
}

const AuthBookmarkButton = ({
  user,
  meme,
  className
}: {
  user: User
} & ToggleLikeButtonProps) => {
  const queryClient = useQueryClient()
  const query = useSuspenseQuery(getFavoritesMemesQueryOpts())

  const isMemeBookmarked = React.useMemo(() => {
    return query.data.bookmarks.some((bookmark) => {
      return bookmark.id === meme.id
    })
  }, [user, query.data])

  const toggleLikeMutation = useMutation({
    mutationFn: toggleBookmarkByMemeId,
    onMutate: async () => {
      const newValue = !isMemeBookmarked

      await queryClient.cancelQueries({
        queryKey: getFavoritesMemesQueryOpts.all
      })

      queryClient.setQueryData(getFavoritesMemesQueryOpts().queryKey, (old) => {
        if (old) {
          if (!newValue) {
            return {
              bookmarks: old.bookmarks.filter((bookmark) => {
                return bookmark.id !== meme.id
              }),
              count: old.count - 1
            }
          }

          return {
            bookmarks: [meme, ...old.bookmarks],
            count: old.count + 1
          }
        }

        return undefined
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries(getMemeByIdQueryOpts(meme.id))
      queryClient.invalidateQueries(getFavoritesMemesQueryOpts())
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
      disabled={toggleLikeMutation.isPending}
      active={isMemeBookmarked}
      className={className}
      onClick={handleToggleLike}
    />
  )
}

const ToggleLikeButton = ({ meme, className }: ToggleLikeButtonProps) => {
  const { user } = useRouteContext({ from: '__root__' })
  const showDialog = useShowDialog()

  if (!user) {
    return (
      <IconButton
        icon={Star}
        active={false}
        className={className}
        onClick={(event) => {
          event.preventDefault()
          showDialog('auth', {})
        }}
      />
    )
  }

  return (
    <React.Suspense fallback={<div />}>
      <AuthBookmarkButton user={user} meme={meme} className={className} />
    </React.Suspense>
  )
}

export default ToggleLikeButton
