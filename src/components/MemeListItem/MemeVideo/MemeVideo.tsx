'use client'

import React from 'react'
import { MemeWithVideo } from '@/constants/meme'

export type MemeVideoProps = {
  meme: MemeWithVideo
} & React.ComponentProps<'video'>

const handlePlay = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
  const target = event.target as HTMLVideoElement

  const allVideos = Array.from(
    document.querySelectorAll<HTMLVideoElement>('video')
  )

  for (const video of allVideos) {
    if (target === video) {
      continue
    } else {
      video.pause()
      video.currentTime = 0
    }
  }
}

const MemeVideo = ({ meme, ...restVideoProps }: MemeVideoProps) => {
  return <video onPlay={handlePlay} {...restVideoProps} />
}

export default MemeVideo
