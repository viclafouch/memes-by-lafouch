import React from 'react'
import { motion } from 'framer-motion'
import { Clapperboard, PlaySquare } from 'lucide-react'
import type { MemeWithBoomarked } from '@/@types/meme'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import ToggleLikeButton from '@/components/Meme/toggle-like-button'
import { MotionLink } from '@/components/motion-link'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { MemeWithVideo } from '@/constants/meme'
import { getVideoStatusByIdQueryOpts } from '@/lib/queries'
import { cn } from '@/lib/utils'
import { matchIsVideoPlayable } from '@/utils/video'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export type MemeListItemProps = {
  meme: MemeWithBoomarked
  layoutContext: string
  size?: keyof typeof sizes
  onPlayClick: (meme: MemeWithVideo) => void
}

const sizes = {
  sm: 'size-6 [&_svg]:size-4',
  md: 'size-8 [&_svg]:size-5',
  lg: 'size-12 [&_svg]:size-7'
}

export const MemeListItem = React.memo(
  ({ meme, onPlayClick, layoutContext, size = 'lg' }: MemeListItemProps) => {
    const isVideoInitialPlayable = matchIsVideoPlayable(meme.video.bunnyStatus)

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
              className="relative w-full h-full"
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
              <button
                className="absolute inset-0 md:opacity-0 group-hover:opacity-100 transition-all z-20 delay-75 cursor-pointer text-white/80 place-items-center group-focus-within:opacity-100 outline-none grid"
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
          <div className="flex flex-col gap-1.5">
            <Link
              to="/library/$memeId"
              params={{ memeId: meme.id }}
              title={meme.title}
              className="line-clamp-1 font-medium leading-none text-gray-100"
            >
              {meme.title}
            </Link>
            <div className="flex flex-row items-center gap-1.5 text-gray-500">
              <span className="text-[13px] leading-none">
                {meme.viewCount} vue{meme.viewCount > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <MotionLink
              to="/studio/$memeId"
              params={{ memeId: meme.id }}
              className={cn(
                'group/icon-button cursor-pointer relative shrink-0 rounded-full hover:bg-[var(--icon-button-color)]/10 active:bg-[var(--icon-button-color)]/20 text-[var(--icon-button-color)] size-8 [&_svg]:size-5',
                sizes[size]
              )}
              style={
                {
                  '--icon-button-color': `rgb(255, 255, 255)`
                } as React.CSSProperties
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-muted-foreground group-hover/icon-button:stroke-[var(--icon-button-color)]"
                aria-hidden="true"
              >
                <Clapperboard />
              </motion.div>
            </MotionLink>
            <ToggleLikeButton meme={meme} className={sizes[size]} />
            <ShareMemeButton meme={meme} className={sizes[size]} />
          </div>
        </div>
      </motion.div>
    )
  }
)
