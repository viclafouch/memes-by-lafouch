import React from 'react'
import { useDebounceValue, useIntersectionObserver } from 'usehooks-ts'
import type { MemeWithVideo } from '@/constants/meme'
import { mergeRefs } from '@/utils/ref'

type MemeVideoProps = {
  meme: MemeWithVideo
} & React.ComponentProps<'video'>

export function matchIsVideoElement(node: Element): node is HTMLVideoElement {
  return node instanceof HTMLVideoElement
}

export function stopVideo(node: Element) {
  if (matchIsVideoElement(node)) {
    node.pause()
  }
}

export function playVideo(node: Element) {
  if (matchIsVideoElement(node)) {
    node.currentTime = 0
    // eslint-disable-next-line promise/prefer-await-to-then
    node.play().catch(() => {})
  }
}

export const stopOtherVideos = (node: HTMLVideoElement) => {
  const targetId = node.getAttribute('data-id')

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

export const MemeVideo = ({
  meme,
  ref: refProps,
  ...restVideoProps
}: MemeVideoProps) => {
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
  const [isIntersectingDebounced] = useDebounceValue(isIntersecting, 300)
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
      ref={mergeRefs([refProps, ref])}
      data-id={id}
      disablePictureInPicture
      controlsList="noremoteplayback"
      src={meme.video.src}
      onPlay={(event) => {
        stopOtherVideos(event.currentTarget)
      }}
      {...restVideoProps}
    />
  )
}
