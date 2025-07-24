import React from 'react'
import { Download, Share2 } from 'lucide-react'
import { useIntersectionObserver } from 'usehooks-ts'
import { DownloadMemeButton } from '@/components/Meme/download-meme-button'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import type { MemeWithVideo } from '@/constants/meme'
import { cloudinaryClient } from '@/lib/cloudinary-client'
import { playVideo, stopOtherVideos, stopVideo } from '@/lib/dom'
import { Delivery } from '@cloudinary/url-gen/actions'
import { scale } from '@cloudinary/url-gen/actions/resize'
import { Format } from '@cloudinary/url-gen/qualifiers'

type MemeListItemProps = {
  meme: MemeWithVideo
}

export const MemeListItem = React.memo(({ meme }: MemeListItemProps) => {
  const { ref } = useIntersectionObserver({
    threshold: 1,
    onChange: (isIntersecting, entry) => {
      if (!isIntersecting) {
        stopVideo(entry.target)
      }
    }
  })

  const thumbnailUrl = cloudinaryClient
    .video(meme.video.cloudinaryId)
    .addTransformation(`so_1s`)
    .resize(scale().width(500))
    .delivery(Delivery.format(Format.avif()))
    .toURL()

  const video = cloudinaryClient
    .video(meme.video.cloudinaryId)
    .resize(scale().width(500))

  return (
    <div className="has-focus-visible:ring-offset-background relative flex w-full flex-col gap-2 text-sm sm:min-w-0 group">
      <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm has-focus-visible:outline-hidden has-focus-visible:ring-2 has-focus-visible:ring-blue-600 has-focus-visible:ring-offset-1 border border-white/10">
        <img
          src={thumbnailUrl}
          className="w-full h-full object-cover bg-muted absolute inset-0 z-10 blur-md lg:blur-none group-hover:blur-md transition-all duration-300 scale-125 lg:scale-100 lg:group-hover:scale-125 origin-center delay-100"
          width="100%"
          loading="lazy"
          height="100%"
          alt={meme.title}
        />
        <video
          src={video.toURL()}
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 z-10 delay-100"
          controls
          poster={thumbnailUrl}
          preload="metadata"
          onMouseLeave={(event) => {
            stopVideo(event.currentTarget)
          }}
          ref={ref}
          onMouseEnter={(event) => {
            playVideo(event.currentTarget)
          }}
          onPlay={(event) => {
            stopOtherVideos(event.currentTarget)
          }}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="line-clamp-1 font-medium leading-none text-gray-100">
            {meme.title}
          </div>
          <div className="flex flex-row items-center gap-1.5 text-gray-500">
            <span className="text-[13px] leading-none">
              {meme.downloadCount} téléchargement
              {meme.downloadCount > 1 ? 's' : null}
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
    </div>
  )
})
