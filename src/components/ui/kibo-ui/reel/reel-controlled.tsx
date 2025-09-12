import React from 'react'
import { Clapperboard } from 'lucide-react'
import { IconButton } from '@/components/animate-ui/buttons/icon'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import { StudioDialog } from '@/components/Meme/studio-dialog'
import ToggleLikeButton from '@/components/Meme/toggle-like-button'
import { buttonVariants } from '@/components/ui/button'
import type { MemeWithVideo } from '@/constants/meme'
import { cn } from '@/lib/utils'
import { ClientOnly, Link } from '@tanstack/react-router'
import {
  Reel,
  type ReelItem,
  ReelMuteButton,
  ReelNavigation,
  ReelPlayButton,
  ReelProgress,
  ReelVideo
} from './index'

type MemeReelsProps = {
  memes: MemeWithVideo[]
}

export const MemeReels = ({ memes }: MemeReelsProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [isMuted, setIsMuted] = React.useState(true)
  const [isStudioDialogOpened, setIsStudioDialogOpened] = React.useState(false)

  const items = React.useMemo(() => {
    return memes.map((meme) => {
      return {
        title: meme.title,
        duration: meme.video.duration,
        id: meme.id,
        type: 'video',
        alt: '',
        src: meme.video.bunnyId
      } satisfies ReelItem
    })
  }, [memes])

  const currentMeme = memes[currentIndex]

  return (
    <Reel
      data={items}
      index={currentIndex}
      muted={isMuted}
      onIndexChange={setCurrentIndex}
      onMutedChange={setIsMuted}
      onPlayingChange={setIsPlaying}
      playing={isPlaying}
    >
      <div className="flex flex-col gap-6 h-dvh relative">
        <div className="w-full h-full md:aspect-[9/16] bg-muted lg:border-x border-muted md:max-w-md mx-auto flex flex-col justify-center relative">
          <div className="flex-1 bg-black relative">
            <img
              src={`https://vz-eb732fb9-3bc.b-cdn.net/${currentMeme.video.bunnyId}/thumbnail.jpg`}
              alt={currentMeme.title}
              className="absolute w-full h-full inset-0 object-cover -z-10 blur-xl opacity-20"
            />
            <ReelProgress />
            <div className="absolute top-0 right-0 left-0 z-20 p-4 pt-6 bg-gradient-to-b from-black/60 to-transparent">
              <div className="text-white">
                <h2 className="font-bold text-xl">{currentMeme.title}</h2>
              </div>
            </div>
            <ReelVideo src={currentMeme.video.bunnyId} />
            <ReelNavigation />
            <div className="flex items-center absolute bottom-0 right-0 z-30 py-2 px-3">
              <ReelMuteButton />
              <ReelPlayButton />
            </div>
          </div>
          <div className="bg-black py-2 px-3 border-t border-muted z-20 flex justify-between">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                aria-label="Retour au site"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' })
                )}
              >
                <img src="/logo.png" alt="Logo" className="h-5" />
              </Link>
              <Link
                to="/memes"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' })
                )}
              >
                Chercher un mème
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                icon={Clapperboard}
                active={false}
                onClick={(event) => {
                  event.preventDefault()
                  setIsStudioDialogOpened(true)
                }}
              />
              <ShareMemeButton meme={currentMeme} />
              <ToggleLikeButton meme={currentMeme} />
              <ClientOnly>
                <React.Suspense fallback={null}>
                  <StudioDialog
                    meme={currentMeme}
                    open={isStudioDialogOpened}
                    onOpenChange={setIsStudioDialogOpened}
                  />
                </React.Suspense>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </Reel>
  )
}
