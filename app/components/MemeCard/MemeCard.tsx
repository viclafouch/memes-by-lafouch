import React from 'react'
import { MemeWithVideo } from 'src/constants/meme'
import DownloadMemeButton from '~/components/DownloadMemeButton'
import ShareMemeButton from '~/components/ShareMemeButton'

export type MemeCardProps = {
  meme: MemeWithVideo
}

const MemeCard = ({ meme }: MemeCardProps) => {
  return (
    <div className="card card-compact bg-base-100 border border-base-300 shadow-xl">
      <div className="flex p-3 z-10 w-full justify-start shrink-0 overflow-inherit color-inherit rounded-t-large pb-0 pt-2 px-4 flex-col items-start">
        <div className="w-full">
          <h3 className="font-semibold text-medium truncate">{meme.title}</h3>
        </div>
      </div>
      <div className="relative flex w-full p-3 flex-auto flex-col h-auto break-words text-left grow-0 overflow-visible py-2">
        <div className="h-56 lg:h-44 aspect-video w-full">
          <video
            className="border border-white/10 w-full h-full object-contain rounded-lg"
            poster={meme.video.poster || undefined}
            controls
            preload="auto"
            src={meme.video.src}
          />
        </div>
      </div>
      <div className="divider my-0" />
      <div className="flex-grow py-2">
        <div className="flex px-3 flex-wrap gap-3">
          {meme.keywords.map((keyword) => {
            return (
              <div key={keyword} className="badge badge-outline">
                {keyword}
              </div>
            )
          })}
        </div>
      </div>
      <div className="divider my-0" />
      <div className="p-3 h-auto flex w-full items-center overflow-hidden">
        <div className="w-full flex justify-end gap-2">
          <ShareMemeButton meme={meme}>Partager</ShareMemeButton>
          <DownloadMemeButton meme={meme}>Telecharger</DownloadMemeButton>
        </div>
      </div>
    </div>
  )
}

export default MemeCard
