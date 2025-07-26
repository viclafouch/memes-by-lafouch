import React from 'react'
import { motion } from 'framer-motion'
import { Download, PlaySquare, Share2 } from 'lucide-react'
import { DownloadMemeButton } from '@/components/Meme/download-meme-button'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import type { MemeWithVideo } from '@/constants/meme'
import { Link } from '@tanstack/react-router'

type MemeListItemProps = {
  meme: MemeWithVideo
  onPlayClick: (meme: MemeWithVideo) => void
}

export const MemeListItem = React.memo(
  ({ meme, onPlayClick }: MemeListItemProps) => {
    return (
      <motion.div className="relative flex w-full flex-col gap-2 text-sm sm:min-w-0 group">
        <motion.div
          className="group bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10"
          layoutId={`item-${meme.id}`}
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
            className="absolute inset-0 md:opacity-0 group-hover:opacity-100 transition-all z-20 delay-75 cursor-pointer text-white/80 place-items-center group-focus-within:opacity-100 outline-none"
            type="button"
            onClick={(event) => {
              event.preventDefault()

              return onPlayClick(meme)
            }}
          >
            <PlaySquare size={42} />
          </button>
        </motion.div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <Link
              to="/library/$memeId"
              params={{ memeId: meme.id }}
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
          <div className="flex items-center gap-1">
            <DownloadMemeButton variant="outline" size="icon" meme={meme}>
              <Download />
            </DownloadMemeButton>
            <ShareMemeButton meme={meme} size="icon" variant="outline">
              <Share2 />
            </ShareMemeButton>
          </div>
        </div>
      </motion.div>
    )
  }
)
