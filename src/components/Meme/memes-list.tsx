import React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { AnimatePresence } from 'framer-motion'
import type { MemeListItemProps } from '@/components/Meme/meme-list-item'
import { MemeListItem } from '@/components/Meme/meme-list-item'
import { PlayerDialog } from '@/components/Meme/player-dialog'
import { StudioDialog } from '@/components/Meme/studio-dialog'
import { OverlaySpinner } from '@/components/ui/overlay-spinner'
import type { MemeWithVideo } from '@/constants/meme'
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
  const [studioMemeSelected, setStudioMemeSelected] =
    React.useState<MemeWithVideo | null>(null)

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

  React.useEffect(() => {
    if (selectedId) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'escapeKey') {
          setSelectedId(null)
        }
      }

      window.addEventListener('message', handleMessage, false)

      return () => {
        window.removeEventListener('message', handleMessage, false)
      }
    }

    return undefined
  }, [selectedId])

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

  const size: MemeListItemProps['size'] = columnGridCount < 5 ? 'md' : 'sm'

  return (
    <div className="w-full">
      <div
        style={
          {
            '--cols': `repeat(${columnGridCount}, 1fr)`
          } as React.CSSProperties
        }
        className="grid gap-5 grid-cols-2 lg:[grid-template-columns:var(--cols)]"
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
          <PlayerDialog
            meme={selectedMeme}
            layoutContext={layoutContext}
            onClose={handleUnSelect}
            onOpenStudio={setStudioMemeSelected}
          />
        ) : null}
      </AnimatePresence>
      <ClientOnly>
        {studioMemeSelected ? (
          <React.Suspense fallback={<OverlaySpinner />}>
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
