import React from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import ToggleLikeButton from '@/components/Meme/toggle-like-button'
import { Button, buttonVariants } from '@/components/ui/button'
import type { MemeWithVideo } from '@/constants/meme'
import { buildVideoImageUrl } from '@/lib/bunny'
import { getInfiniteReelsQueryOpts } from '@/lib/queries'
import { useDebouncer } from '@tanstack/react-pacer'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useVirtualizer } from '@tanstack/react-virtual'

export const Reel = React.memo(
  ({
    meme,
    isMuted,
    isPlaying,
    setIsPlaying,
    setIsMuted,
    isActive
  }: {
    meme: MemeWithVideo
    isMuted: boolean
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
    setIsMuted: React.Dispatch<React.SetStateAction<boolean>>
    isPlaying: boolean
    isActive: boolean
  }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null)

    React.useEffect(() => {
      const video = videoRef.current

      if (!video) {
        return
      }

      video.muted = isMuted
    }, [isMuted])

    React.useEffect(() => {
      const video = videoRef.current

      if (video) {
        if (!isActive) {
          video.currentTime = 0
        }

        if (isActive && isPlaying) {
          video.play().catch(() => {
            // Ignore autoplay errors
          })
        } else {
          video.pause()
        }
      }
    }, [isActive, isPlaying])

    return (
      <div className="size-full relative select-none">
        <div className="absolute top-0 right-0 left-0 z-20 p-4 pt-6 bg-gradient-to-b from-black/60 to-transparent">
          <Link
            to="/memes/$memeId"
            params={{ memeId: meme.id }}
            className="text-white"
          >
            <h2 className="font-bold text-lg">{meme.title}</h2>
          </Link>
        </div>
        <img
          src={buildVideoImageUrl(meme.video.bunnyId)}
          alt={meme.title}
          className="absolute size-full inset-0 object-cover blur-xl opacity-80"
        />
        <motion.video
          className="absolute inset-0 size-full"
          muted={isMuted}
          playsInline
          loop
          ref={videoRef}
          preload="none"
          poster={buildVideoImageUrl(meme.video.bunnyId)}
          src={`https://vz-eb732fb9-3bc.b-cdn.net/${meme.video.bunnyId}/original`}
        />
        <div
          className="absolute inset-0 bg-transparent"
          aria-hidden="true"
          onTouchStart={() => {
            return setIsPlaying(false)
          }}
          onTouchEnd={() => {
            return setIsPlaying(true)
          }}
        />
        <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-b to-black/60 from-transparent p-3">
          <div className="w-full flex justify-between items-end">
            <div>
              <Link
                to="/"
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                <img src="/logo.png" alt="Logo" className="w-5" />
                Retour au site
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <ShareMemeButton
                className="flex md:hidden"
                meme={meme}
                size="iconLg"
              />
              <ToggleLikeButton meme={meme} size="iconLg" />
              <Button
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={() => {
                  return setIsPlaying((prevState) => {
                    return !prevState
                  })
                }}
                size="iconLg"
                variant="ghost"
              >
                {isPlaying ? <Pause /> : <Play />}
              </Button>
              <Button
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                onClick={() => {
                  return setIsMuted((prevState) => {
                    return !prevState
                  })
                }}
                size="iconLg"
                variant="ghost"
              >
                {isMuted ? <VolumeX /> : <Volume2 />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

export const MemeReels = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [isMuted, setIsMuted] = React.useState(true)
  const parentRef = React.useRef<HTMLDivElement>(null)

  const infiniteReels = useInfiniteQuery(getInfiniteReelsQueryOpts())

  const observerRef = React.useRef(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index')!, 10)
            setActiveDebouncer.maybeExecute(index)
          }
        })
      },
      { threshold: 0.7 }
    )
  )

  const setActiveDebouncer = useDebouncer(
    (index: number) => {
      setCurrentIndex(index)
      setIsPlaying(true)
    },
    { wait: 300 }
  )

  const memesRefs = React.useMemo(() => {
    return (
      infiniteReels.data?.pages
        .flatMap(({ memes }) => {
          return memes
        })
        .map((meme, index) => {
          return {
            data: meme,
            id: meme.id,
            ref: React.createRef<HTMLDivElement | null>(),
            index
          }
        }) ?? []
    )
  }, [infiniteReels.data])

  const rowVirtualizer = useVirtualizer({
    count: memesRefs.length,
    getScrollElement: () => {
      return parentRef.current
    },
    estimateSize: () => {
      return window.innerHeight
    },
    overscan: 1
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  React.useEffect(() => {
    virtualItems.forEach((virtualRow) => {
      const { ref } = memesRefs[virtualRow.index]

      if (ref.current) {
        observerRef.current.observe(ref.current)
      }
    })

    return () => {
      return observerRef.current.disconnect()
    }
  }, [memesRefs, virtualItems])

  React.useEffect(() => {
    const [item] = [...virtualItems].reverse()

    if (!item) {
      return
    }

    if (
      memesRefs.length - 3 < item.index &&
      infiniteReels.hasNextPage &&
      !infiniteReels.isFetchingNextPage
    ) {
      infiniteReels.fetchNextPage()
    }
  }, [
    infiniteReels.hasNextPage,
    infiniteReels.fetchNextPage,
    memesRefs.length,
    infiniteReels.isFetchingNextPage,
    virtualItems
  ])

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <div
        className="size-full md:aspect-[9/16] bg-muted lg:border-x border-muted md:max-w-md mx-auto flex flex-col overflow-auto snap-y snap-mandatory no-scrollbar overscroll-contain"
        ref={parentRef}
      >
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: 'relative',
            width: '100%'
          }}
        >
          {virtualItems.map((virtualRow) => {
            const { data, ref, index } = memesRefs[virtualRow.index]

            return (
              <div
                className="snap-start absolute top-0 left-0 w-full h-dvh overflow-hidden"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  display:
                    rowVirtualizer.isScrolling &&
                    (index > currentIndex + 1 || index < currentIndex - 1)
                      ? 'none'
                      : 'block'
                }}
                data-index={index}
                ref={ref}
                key={data.id}
              >
                <Reel
                  meme={data}
                  setIsPlaying={setIsPlaying}
                  setIsMuted={setIsMuted}
                  isPlaying={isPlaying}
                  isActive={currentIndex === index}
                  isMuted={isMuted}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
