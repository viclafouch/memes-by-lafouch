import React from 'react'
import { Download, Share2 } from 'lucide-react'
import { DownloadMemeButton } from '@/components/Meme/download-meme-button'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import type { MemeWithVideo } from '@/constants/meme'
import { Link } from '@tanstack/react-router'

type MemeListItemProps = {
  meme: MemeWithVideo
}

export const MemeListItem = React.memo(({ meme }: MemeListItemProps) => {
  return (
    <div className="relative flex w-full flex-col gap-2 text-sm sm:min-w-0 group">
      <div className="group bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
        <img
          src={`https://vz-eb732fb9-3bc.b-cdn.net/${meme.video.bunnyId}/thumbnail.jpg`}
          alt={meme.title}
          className="absolute w-full h-full inset-0 object-cover"
        />
        <img
          src={`https://vz-eb732fb9-3bc.b-cdn.net/${meme.video.bunnyId}/preview.webp`}
          alt={meme.title}
          className="absolute w-full h-full inset-0 hidden group-hover:block z-10 object-cover"
        />
      </div>
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
            <span className="text-[13px] leading-none">1 vue</span>
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
    </div>
  )
})
