import React from 'react'
import type { User } from 'better-auth'
import { motion } from 'framer-motion'
import {
  Clapperboard,
  Download,
  EllipsisVertical,
  PlaySquare,
  Star
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { AuthDialog } from '@/components/User/auth-dialog'
import type { MemeWithVideo } from '@/constants/meme'
import { useDownloadMeme } from '@/hooks/use-download-meme'
import { authClient } from '@/lib/auth-client'
import {
  getFavoritesMemesQueryOpts,
  getMemeByIdQueryOpts,
  getVideoStatusByIdQueryOpts
} from '@/lib/queries'
import { cn } from '@/lib/utils'
import { toggleBookmarkByMemeId } from '@/server/meme'
import { matchIsVideoPlayable } from '@/utils/video'
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export type MemeListItemProps = {
  meme: MemeWithVideo
  layoutContext: string
  size: keyof typeof sizes
  onPlayClick: (meme: MemeWithVideo) => void
}

const sizes = {
  sm: {
    title: 'font-normal text-xs leading-none',
    views: 'text-xs',
    icon: 'size-4'
  },
  md: {
    title: 'font-medium text-md leading-none',
    views: 'text-md',
    icon: 'size-5'
  }
} as const

const FavoriteItem = ({ user, meme }: { user: User; meme: MemeWithVideo }) => {
  const queryClient = useQueryClient()
  const query = useSuspenseQuery(getFavoritesMemesQueryOpts())

  const isMemeBookmarked = React.useMemo(() => {
    return query.data.some((bookmark) => {
      return bookmark.id === meme.id
    })
  }, [user, query.data])

  const toggleFavorite = useMutation({
    mutationFn: toggleBookmarkByMemeId,
    onMutate: async () => {
      const newValue = !isMemeBookmarked

      await queryClient.cancelQueries({
        queryKey: getFavoritesMemesQueryOpts.all
      })

      queryClient.setQueryData(getFavoritesMemesQueryOpts().queryKey, (old) => {
        if (old) {
          if (!newValue) {
            return old.filter((bookmark) => {
              return bookmark.id !== meme.id
            })
          }

          return [meme, ...old]
        }

        return undefined
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries(getMemeByIdQueryOpts(meme.id))
      queryClient.invalidateQueries(getFavoritesMemesQueryOpts())
    }
  })

  const handleToggleFavorite = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    toggleFavorite.mutate({
      data: meme.id
    })
  }

  return (
    <DropdownMenuItem onClick={handleToggleFavorite}>
      <Star
        data-active={isMemeBookmarked}
        className="data-[active=true]:fill-muted-foreground"
      />
      {isMemeBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    </DropdownMenuItem>
  )
}

const FavoriteItemGuard = ({ meme }: { meme: MemeWithVideo }) => {
  const session = authClient.useSession()
  const [isLoginDialogOpened, setIsLoginDialogOpened] = React.useState(false)

  if (!session.data) {
    return (
      <>
        <AuthDialog
          open={isLoginDialogOpened}
          onOpenChange={setIsLoginDialogOpened}
        />
        <DropdownMenuItem
          onClick={(event) => {
            event.preventDefault()
            setIsLoginDialogOpened(true)
          }}
        >
          <Star />
          Ajouter aux favoris
        </DropdownMenuItem>
      </>
    )
  }

  return (
    <React.Suspense fallback={<div />}>
      <FavoriteItem user={session.data.user} meme={meme} />
    </React.Suspense>
  )
}

export const MemeListItem = React.memo(
  ({ meme, onPlayClick, layoutContext, size = 'md' }: MemeListItemProps) => {
    const isVideoInitialPlayable = matchIsVideoPlayable(meme.video.bunnyStatus)

    const downloadMutation = useDownloadMeme()

    const videoStatusQuery = useQuery({
      ...getVideoStatusByIdQueryOpts(meme.video.id),
      enabled: !isVideoInitialPlayable,
      refetchInterval: ({ state }) => {
        if (state.data?.status && matchIsVideoPlayable(state.data.status)) {
          return false
        }

        return 3000
      }
    })

    const status = videoStatusQuery.data?.status ?? meme.video.bunnyStatus
    const isStatusPlayable = matchIsVideoPlayable(status)

    return (
      <motion.div
        className="relative flex w-full flex-col gap-2 text-sm sm:min-w-0 group"
        layoutId={`${layoutContext}-item-${meme.id}`}
      >
        <motion.div className="group bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
          {isStatusPlayable ? (
            <motion.div
              initial={{ opacity: isVideoInitialPlayable ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="relative w-full h-full isolate"
            >
              <img
                src={`https://vz-eb732fb9-3bc.b-cdn.net/${meme.video.bunnyId}/thumbnail.jpg`}
                alt={meme.title}
                className="absolute w-full h-full inset-0 object-cover"
              />
              <img
                src={`https://vz-eb732fb9-3bc.b-cdn.net/${meme.video.bunnyId}/preview.webp`}
                alt={meme.title}
                className="absolute w-full h-full inset-0 hidden duration-600 group-hover:block transition-discrete z-10 object-cover opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:block"
              />
              <div className="absolute bottom-1 left-1 z-30">
                <Badge size="sm" variant="black">
                  {meme.video.duration} sec
                </Badge>
              </div>
              <button
                className="absolute inset-0 md:opacity-0 group-hover:opacity-100 transition-all z-40 delay-75 cursor-pointer text-white/80 place-items-center group-focus-within:opacity-100 outline-none grid"
                type="button"
                onClick={(event) => {
                  event.preventDefault()

                  return onPlayClick(meme)
                }}
              >
                <PlaySquare size={42} />
              </button>
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center relative">
              <Skeleton className="w-full h-full bg-stone-700 absolute inset-0" />
              <div className="absolute">
                <Badge variant="outline">Processing...</Badge>
              </div>
            </div>
          )}
        </motion.div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-y-1">
            <Link
              to="/memes/$memeId"
              params={{ memeId: meme.id }}
              title={meme.title}
              className={cn('line-clamp-1 text-gray-100', sizes[size].title)}
            >
              {meme.title}
            </Link>
            <div className="flex flex-row items-center gap-1.5 text-gray-500">
              <span className={cn(sizes[size].views)}>
                {meme.viewCount} vue{meme.viewCount > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className={cn(sizes[size].icon)} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/studio/$memeId" params={{ memeId: meme.id }}>
                    <Clapperboard />
                    Ouvrir dans studio
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    return downloadMutation.mutate(meme)
                  }}
                >
                  <Download />
                  Télécharger
                </DropdownMenuItem>
                <FavoriteItemGuard meme={meme} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>
    )
  }
)
