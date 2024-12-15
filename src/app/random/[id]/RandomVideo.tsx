'use client'

import React from 'react'

export type RandomVideoProps = {
  src: string
  poster?: string | undefined
  onEnded?: () => void
}

const RandomVideo = ({
  src,
  poster = undefined,
  onEnded
}: RandomVideoProps) => {
  const handleEnded = () => {
    onEnded?.()
  }

  return (
    <video
      className="absolute h-full w-full object-contains inset-0"
      src={src}
      poster={poster}
      autoPlay
      controls
      onEnded={handleEnded}
    />
  )
}

export default RandomVideo
