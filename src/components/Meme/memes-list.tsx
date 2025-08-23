import React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { AnimatePresence, motion } from 'framer-motion'
import { Clapperboard, Download, Share2, X } from 'lucide-react'
import type { MemeListItemProps } from '@/components/Meme/meme-list-item'
import { MemeListItem } from '@/components/Meme/meme-list-item'
import { StudioDialog } from '@/components/Meme/studio-dialog'
import { Button } from '@/components/ui/button'
import type { MemeWithVideo } from '@/constants/meme'
import { useDownloadMeme } from '@/hooks/use-download-meme'
import { useShareMeme } from '@/hooks/use-share-meme'
import { ClientOnly } from '@tanstack/react-router'

export type MemesListProps = {
  memes: MemeWithVideo[]
  layoutContext: string
  columnGridCount?: number
}

export const MemesList = ({
  memes,
  layoutContext,
  columnGridCount = 4
}: MemesListProps) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [studioMemeSelected, setStudioMemeSelected] =
    React.useState<MemeWithVideo | null>(null)

  const shareMeme = useShareMeme()
  const downloadMeme = useDownloadMeme()

  useHotkeys(
    'escape',
    () => {
      return setSelectedId(null)
    },
    {
      enabled: selectedId !== null
    },
    [selectedId]
  )

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

  const size: MemeListItemProps['size'] = columnGridCount < 5 ? 'md' : 'sm'

  return (
    <div className="w-full">
      <div
        style={
          {
            '--cols': `repeat(${columnGridCount}, 1fr)`
          } as React.CSSProperties
        }
        className="grid gap-5 md:grid-cols-2 lg:[grid-template-columns:var(--cols)]"
      >
        {memes.map((meme) => {
          return (
            <MemeListItem
              onPlayClick={handleSelect}
              key={meme.id}
              size={size}
              layoutContext={layoutContext}
              meme={meme}
              onOpenStudioClick={setStudioMemeSelected}
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
              className="bg-black/90 absolute inset-0"
            />
            <motion.div
              className="absolute top-4 right-4"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
            >
              <Button size="icon" onClick={handleUnSelect}>
                <X />
              </Button>
            </motion.div>
            <motion.div
              layoutId={`${layoutContext}-item-${selectedId}`}
              onLayoutAnimationComplete={handleLayoutAnimationComplete}
              className="relative w-[800px] max-w-[90vw]"
            >
              <div className="w-full h-full flex flex-col items-center gap-y-4">
                <h3 className="text-center w-full text-balance text-lg font-bold">
                  {selectedMeme.title}
                </h3>
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
                <div className="w-full flex sm:justify-center gap-2 flex-col sm:flex-row">
                  <Button
                    size="default"
                    disabled={shareMeme.isPending}
                    className="md:hidden"
                    onClick={() => {
                      return shareMeme.mutate(selectedMeme)
                    }}
                  >
                    <Share2 />
                    Partager
                  </Button>
                  <Button
                    size="default"
                    disabled={downloadMeme.isPending}
                    onClick={() => {
                      return downloadMeme.mutate(selectedMeme)
                    }}
                  >
                    <Download />
                    Télécharger
                  </Button>
                  <Button
                    size="default"
                    variant="secondary"
                    onClick={() => {
                      return setStudioMemeSelected(selectedMeme)
                    }}
                  >
                    <Clapperboard />
                    Ouvrir dans Studio
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ClientOnly>
        {studioMemeSelected ? (
          <React.Suspense fallback={null}>
            <StudioDialog
              meme={studioMemeSelected}
              open
              onOpenChange={() => {
                setStudioMemeSelected(null)
              }}
            />
          </React.Suspense>
        ) : null}
      </ClientOnly>
    </div>
  )
}
