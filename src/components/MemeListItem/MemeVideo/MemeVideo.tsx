'use client'

import React from 'react'
import { useDebounce } from 'use-debounce'
import { MemeWithVideo } from '@/constants/meme'
import { myVideoLoader } from '@/utils/cloudinary'
import useIntersectionObserver from '@react-hook/intersection-observer'

export type MemeVideoProps = {
  meme: MemeWithVideo
} & React.ComponentProps<'video'>

const stopVideo = (videoElement: HTMLVideoElement) => {
  videoElement.pause()
}

const handlePlay = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
  const target = event.target as HTMLVideoElement
  const targetId = target.getAttribute('data-id')

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }

  const allVideos = Array.from(
    document.querySelectorAll<HTMLVideoElement>('video')
  )

  for (const video of allVideos) {
    const id = video.getAttribute('data-id')

    if (targetId === id) {
      continue
    } else {
      stopVideo(video)
    }
  }
}

const isVideoPlaying = (videoElement: HTMLVideoElement) => {
  return Boolean(
    videoElement.currentTime > 0 &&
      !videoElement.paused &&
      !videoElement.ended &&
      videoElement.readyState > 2
  )
}

const MemeVideo = ({ meme, src, ...restVideoProps }: MemeVideoProps) => {
  const [ref, setRef] = React.useState<HTMLVideoElement | null>(null)
  const { isIntersecting } = useIntersectionObserver(ref, {
    rootMargin: '-64px 0px 0px 0px'
  })
  // Use to preload video
  const [isIntersectingDebounced] = useDebounce(isIntersecting, 300)

  const cloudinarySrc = src
    ? myVideoLoader({
        src
      })
    : undefined

  React.useEffect(() => {
    if (ref && isVideoPlaying(ref) && !isIntersecting) {
      stopVideo(ref)
    }
  }, [ref, isIntersecting])

  React.useEffect(() => {
    if (isIntersectingDebounced && ref && ref.preload !== 'auto') {
      ref.preload = 'auto'
    }
  }, [isIntersectingDebounced, ref])

  return (
    <video
      ref={setRef}
      src={cloudinarySrc}
      onPlay={handlePlay}
      {...restVideoProps}
    />
  )
}

export default MemeVideo
