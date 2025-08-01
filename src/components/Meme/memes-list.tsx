import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { MemeWithBoomarked } from '@/@types/meme'
import { MemeListItem } from '@/components/Meme/meme-list-item'
import type { MemeWithVideo } from '@/constants/meme'

export type MemesListProps = {
  memes: MemeWithBoomarked[]
  layoutContext: string
}

export const MemesList = ({ memes, layoutContext }: MemesListProps) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  if (memes.length === 0) {
    return <p className="text-muted-foreground">Aucun résultat</p>
  }

  const handleSelect = (meme: MemeWithVideo) => {
    setSelectedId(meme.id)
  }

  const handleUnSelect = () => {
    setSelectedId(null)
  }

  const selectedMeme = memes.find((meme) => {
    return meme.id === selectedId
  })

  const handleLayoutAnimationComplete = async () => {
    if (iframeRef.current) {
      const player = new window.playerjs.Player(iframeRef.current)

      player.on('ready', player.play)
    }
  }

  return (
    <div className="w-full">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {memes.map((meme) => {
          return (
            <MemeListItem
              onPlayClick={handleSelect}
              key={meme.id}
              layoutContext={layoutContext}
              meme={meme}
            />
          )
        })}
      </div>
      <AnimatePresence>
        {selectedMeme ? (
          <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleUnSelect}
              role="presentation"
              className="bg-black/50 absolute inset-0"
            />
            <motion.div
              layoutId={`${layoutContext}-item-${selectedId}`}
              onLayoutAnimationComplete={handleLayoutAnimationComplete}
              className="relative w-[800px] max-w-[90vw] aspect-video"
            >
              <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
                <iframe
                  src={`https://iframe.mediadelivery.net/embed/471900/${selectedMeme.video.bunnyId}?autoplay=false`}
                  loading="lazy"
                  ref={iframeRef}
                  title={selectedMeme.title}
                  className="w-full h-full"
                  allow="autoplay"
                />
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
