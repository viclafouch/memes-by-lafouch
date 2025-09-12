/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-constructed-context-values */
import type {
  ComponentProps,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
  VideoHTMLAttributes
} from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useControllableState } from '@radix-ui/react-use-controllable-state'

// Explicit type for reel items
export type ReelItem = {
  id: string | number
  type: 'video' | 'image'
  src: string
  duration: number // Duration in seconds for both video and image
  alt?: string
  title?: string
  description?: string
}

type ReelContextType = {
  currentIndex: number
  setCurrentIndex: (index: number) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  isMuted: boolean
  setIsMuted: (muted: boolean) => void
  progress: number
  setProgress: (progress: number) => void
  duration: number
  setDuration: (duration: number) => void
  data: ReelItem[]
  currentItem: ReelItem
  isNavigating: boolean
  setIsNavigating: (navigating: boolean) => void
}

const ReelContext = createContext<ReelContextType | undefined>(undefined)

const useReelContext = () => {
  const context = useContext(ReelContext)

  if (!context) {
    throw new Error('useReelContext must be used within a Reel')
  }

  return context
}

export type ReelProps = {
  data: ReelItem[]
  defaultIndex?: number
  index?: number
  onIndexChange?: (index: number) => void
  defaultPlaying?: boolean
  playing?: boolean
  onPlayingChange?: (playing: boolean) => void
  defaultMuted?: boolean
  muted?: boolean
  onMutedChange?: (muted: boolean) => void
  autoPlay?: boolean
  children?: ReactNode
}

export const Reel = ({
  data,
  defaultIndex = 0,
  index: controlledIndex,
  onIndexChange: controlledOnIndexChange,
  defaultPlaying,
  playing: controlledPlaying,
  onPlayingChange: controlledOnPlayingChange,
  defaultMuted = true,
  muted: controlledMuted,
  onMutedChange: controlledOnMutedChange,
  autoPlay = true,
  children
}: ReelProps) => {
  const [currentIndex, setCurrentIndexState] = useControllableState({
    defaultProp: defaultIndex,
    prop: controlledIndex,
    onChange: controlledOnIndexChange
  })

  const [isPlaying, setIsPlaying] = useControllableState({
    defaultProp: defaultPlaying ?? autoPlay,
    prop: controlledPlaying,
    onChange: controlledOnPlayingChange
  })

  const [isMuted, setIsMuted] = useControllableState({
    defaultProp: defaultMuted,
    prop: controlledMuted,
    onChange: controlledOnMutedChange
  })

  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)

  const setCurrentIndex = useCallback(
    (index: number) => {
      setProgress(0) // Reset progress immediately to prevent showing 100% during transition
      setCurrentIndexState(index)
    },
    [setCurrentIndexState]
  )

  const currentItem = data[currentIndex]

  return (
    <ReelContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        isPlaying,
        setIsPlaying,
        isMuted,
        setIsMuted,
        progress,
        setProgress,
        duration,
        setDuration,
        data,
        currentItem,
        isNavigating,
        setIsNavigating
      }}
    >
      {children}
    </ReelContext.Provider>
  )
}

export type ReelVideoProps = VideoHTMLAttributes<HTMLVideoElement>

const MS_TO_SECONDS = 1000
const PERCENTAGE = 100

export const ReelVideo = ({ className, ...props }: ReelVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const {
    isPlaying,
    isMuted,
    setDuration,
    setProgress,
    currentIndex,
    setCurrentIndex,
    data,
    progress,
    currentItem
  } = useReelContext()
  const animationFrameRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number | undefined>(undefined)
  const pausedProgressRef = useRef<number>(0)
  const { duration } = currentItem

  // Set duration when component mounts or currentIndex changes
  useEffect(() => {
    setDuration(duration)
    pausedProgressRef.current = 0
  }, [duration, setDuration])

  // Handle muting
  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    video.muted = isMuted
  }, [isMuted])

  // Store progress when pausing
  useEffect(() => {
    if (!isPlaying) {
      pausedProgressRef.current = progress
    }
  }, [isPlaying, progress])

  // Handle play/pause with duration-based progress
  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (isPlaying) {
      video.play().catch(() => {
        // Ignore autoplay errors
      })

      // Start progress animation only when not transitioning
      const elapsedTime = (pausedProgressRef.current * duration) / PERCENTAGE
      startTimeRef.current = performance.now() - elapsedTime * MS_TO_SECONDS

      const updateProgress = (currentTime: number) => {
        const elapsed =
          (currentTime - (startTimeRef.current || 0)) / MS_TO_SECONDS
        const newProgress = (elapsed / duration) * PERCENTAGE

        if (newProgress >= PERCENTAGE) {
          const totalItems = data?.length || 0

          if (currentIndex < totalItems - 1) {
            setCurrentIndex(currentIndex + 1)
          } else {
            setCurrentIndex(0)
          }
        } else {
          setProgress(newProgress)
          animationFrameRef.current = requestAnimationFrame(updateProgress)
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateProgress)
    } else {
      video.pause()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, duration, currentIndex, setProgress, setCurrentIndex, data])

  useEffect(() => {
    const video = videoRef.current

    if (video) {
      video.currentTime = 0
    }
  }, [currentIndex])

  return (
    <video
      className={cn('absolute inset-0 size-full', className)}
      loop
      muted={isMuted}
      playsInline
      autoPlay
      ref={videoRef}
      {...props}
      src={`https://vz-eb732fb9-3bc.b-cdn.net/${props.src}/original`}
    />
  )
}

export type ReelProgressProps = HTMLAttributes<HTMLDivElement> & {
  children?: (
    item: ReelItem,
    index: number,
    isActive: boolean,
    progress: number
  ) => ReactNode
}

export const ReelProgress = ({
  className,
  children,
  ...props
}: ReelProgressProps) => {
  const { progress, currentIndex, data } = useReelContext()
  const FULL_PROGRESS = 100

  const calculateProgress = (index: number) => {
    if (index < currentIndex) {
      return FULL_PROGRESS
    }

    if (index === currentIndex) {
      return progress
    }

    return 0
  }

  if (typeof children === 'function') {
    return (
      <div
        className={cn(
          'absolute top-0 right-0 left-0 z-40 flex gap-1 p-2',
          className
        )}
        {...props}
      >
        {data.map((item, index) => {
          return (
            <div className="relative flex-1" key={`${item.id}-progress`}>
              {children(
                item,
                index,
                index === currentIndex,
                calculateProgress(index)
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'absolute top-0 right-0 left-0 z-40 flex gap-1 p-2',
        className
      )}
      {...props}
    >
      {data.map((item, index) => {
        return (
          <Progress
            className="h-0.5 flex-1 bg-white/30 [&>div]:bg-white [&>div]:transition-none"
            key={`${item.id}-progress`}
            value={calculateProgress(index)}
          />
        )
      })}
    </div>
  )
}

export type ReelControlsProps = HTMLAttributes<HTMLDivElement>

export const ReelControls = ({ className, ...props }: ReelControlsProps) => {
  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 left-0 z-20 flex items-center justify-between p-4',
        'bg-gradient-to-t from-black/60 to-transparent',
        className
      )}
      {...props}
    />
  )
}

export type ReelPreviousButtonProps = ComponentProps<typeof Button>

export const ReelPreviousButton = ({
  className,
  children,
  ...props
}: ReelPreviousButtonProps) => {
  const { currentIndex, setCurrentIndex, setIsNavigating } = useReelContext()
  const NAVIGATION_RESET_DELAY = 50

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsNavigating(true)
      setCurrentIndex(currentIndex - 1)
      setTimeout(() => {
        return setIsNavigating(false)
      }, NAVIGATION_RESET_DELAY)
    }
  }

  return (
    <Button
      aria-label="Previous"
      className={cn(
        'rounded-full text-white hover:bg-white/10 hover:text-white',
        className
      )}
      disabled={currentIndex === 0}
      onClick={handlePrevious}
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    >
      {children || <ChevronLeft className="size-4" />}
    </Button>
  )
}

export type ReelNextButtonProps = ComponentProps<typeof Button>

export const ReelNextButton = ({
  className,
  children,
  ...props
}: ReelNextButtonProps) => {
  const { currentIndex, setCurrentIndex, data, setIsNavigating } =
    useReelContext()
  const totalItems = data?.length || 0
  const NAVIGATION_RESET_DELAY = 50

  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      setIsNavigating(true)
      setCurrentIndex(currentIndex + 1)
      setTimeout(() => {
        return setIsNavigating(false)
      }, NAVIGATION_RESET_DELAY)
    }
  }

  return (
    <Button
      aria-label="Next"
      className={cn(
        'rounded-full text-white hover:bg-white/10 hover:text-white',
        className
      )}
      disabled={currentIndex === totalItems - 1}
      onClick={handleNext}
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    >
      {children || <ChevronRight className="size-4" />}
    </Button>
  )
}

export type ReelPlayButtonProps = ComponentProps<typeof Button>

export const ReelPlayButton = ({
  className,
  children,
  ...props
}: ReelPlayButtonProps) => {
  const { isPlaying, setIsPlaying } = useReelContext()

  return (
    <Button
      aria-label={isPlaying ? 'Pause' : 'Play'}
      className={cn(
        'rounded-full text-white hover:bg-white/10 hover:text-white',
        className
      )}
      onClick={() => {
        return setIsPlaying(!isPlaying)
      }}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ||
        (isPlaying ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        ))}
    </Button>
  )
}

export type ReelMuteButtonProps = ComponentProps<typeof Button>

export const ReelMuteButton = ({
  className,
  children,
  ...props
}: ReelMuteButtonProps) => {
  const { isMuted, setIsMuted } = useReelContext()

  return (
    <Button
      aria-label={isMuted ? 'Unmute' : 'Mute'}
      className={cn(
        'rounded-full text-white hover:bg-white/10 hover:text-white',
        className
      )}
      onClick={() => {
        return setIsMuted(!isMuted)
      }}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ||
        (isMuted ? (
          <VolumeX className="size-4" />
        ) : (
          <Volume2 className="size-4" />
        ))}
    </Button>
  )
}

export type ReelNavigationProps = HTMLAttributes<HTMLButtonElement>

export const ReelNavigation = ({
  className,
  ...props
}: ReelNavigationProps) => {
  const { setCurrentIndex, currentIndex, data, setIsNavigating } =
    useReelContext()
  const totalItems = data?.length || 0
  const NAVIGATION_RESET_DELAY = 50
  const HALF_WIDTH_DIVISOR = 2

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const xPosition = event.clientX - rect.left
    const { width } = rect

    if (xPosition < width / HALF_WIDTH_DIVISOR) {
      if (currentIndex > 0) {
        setIsNavigating(true)
        setCurrentIndex(currentIndex - 1)
        setTimeout(() => {
          return setIsNavigating(false)
        }, NAVIGATION_RESET_DELAY)
      }
    } else if (currentIndex < totalItems - 1) {
      setIsNavigating(true)
      setCurrentIndex(currentIndex + 1)
      setTimeout(() => {
        return setIsNavigating(false)
      }, NAVIGATION_RESET_DELAY)
    }
  }

  return (
    <button
      className={cn('absolute inset-0 z-10 flex', className)}
      onClick={handleClick}
      type="button"
      {...props}
    >
      <div className="flex-1 cursor-pointer" />
      <div className="flex-1 cursor-pointer" />
    </button>
  )
}

export type ReelOverlayProps = HTMLAttributes<HTMLDivElement>

export const ReelOverlay = ({ className, ...props }: ReelOverlayProps) => {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-30', className)}
      {...props}
    />
  )
}
