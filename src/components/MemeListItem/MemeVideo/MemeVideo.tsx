'use client'

import React from 'react'
import { MemeWithVideo } from '@/constants/meme'

export type MemeVideoProps = {
  meme: MemeWithVideo
} & React.ComponentProps<'video'>

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
      video.pause()
      video.currentTime = 0
    }
  }
}

const MemeVideo = ({ meme, ...restVideoProps }: MemeVideoProps) => {
  const id = React.useId()

  return <video data-id={id} onPlay={handlePlay} {...restVideoProps} />
}

export default MemeVideo
