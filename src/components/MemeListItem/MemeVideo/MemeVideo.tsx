'use client'

import React from 'react'
import { useDebounce } from 'use-debounce'
import { useIntersectionObserver } from 'usehooks-ts'
import type { MemeWithVideo } from '@/constants/meme'
import { myVideoLoader } from '@/utils/cloudinary'

export type MemeVideoProps = {
  meme: MemeWithVideo
} & React.ComponentProps<'video'>

function matchIsVideoElement(node: Element): node is HTMLVideoElement {
  return node instanceof HTMLVideoElement
}

const stopVideo = (node: Element) => {
  if (matchIsVideoElement(node)) {
    node.pause()
  }
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

const isVideoPlaying = (node: Element) => {
  if (matchIsVideoElement(node)) {
    return Boolean(
      node.currentTime > 0 && !node.paused && !node.ended && node.readyState > 2
    )
  }

  return false
}

const MemeVideo = ({ meme, src, ...restVideoProps }: MemeVideoProps) => {
  const id = React.useId()
  const { ref, entry, isIntersecting } = useIntersectionObserver({
    rootMargin: '-64px 0px 0px 0px',
    onChange: (isInterstg: boolean, { target }) => {
      if (!isInterstg && isVideoPlaying(target)) {
        stopVideo(target)
      }
    }
  })
  // Use to preload video
  const [isIntersectingDebounced] = useDebounce(isIntersecting, 300)
  const isVisible = isIntersectingDebounced && isIntersecting

  React.useEffect(() => {
    if (
      isVisible &&
      entry &&
      matchIsVideoElement(entry.target) &&
      entry.target.preload !== 'auto'
    ) {
      entry.target.preload = 'auto'
    }
  }, [isVisible, entry])

  return (
    <video
      ref={ref}
      data-id={id}
      src={
        src
          ? myVideoLoader({
              src
            })
          : undefined
      }
      onPlay={handlePlay}
      {...restVideoProps}
    />
  )
}

export default MemeVideo
