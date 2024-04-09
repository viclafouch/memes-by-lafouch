'use client'

import React from 'react'
import { MemeWithVideo } from '@/constants/meme'
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

const MemeVideo = ({ meme, ...restVideoProps }: MemeVideoProps) => {
  const id = React.useId()
  const [ref, setRef] = React.useState<HTMLVideoElement | null>(null)
  const { isIntersecting } = useIntersectionObserver(ref, {
    rootMargin: '-64px 0px 0px 0px'
  })

  React.useEffect(() => {
    if (ref && isVideoPlaying(ref) && !isIntersecting) {
      stopVideo(ref)
    } else if (isIntersecting && ref) {
      ref.preload = 'auto'
    }
  }, [ref, isIntersecting])

  return (
    <video ref={setRef} data-id={id} onPlay={handlePlay} {...restVideoProps} />
  )
}

export default MemeVideo
