'use client'

import React from 'react'
import { MemeWithVideo } from '@/constants/meme'

export type MemeVideoProps = {
  meme: MemeWithVideo
} & React.ComponentProps<'video'>

const MemeVideo = ({ meme, ...restVideoProps }: MemeVideoProps) => {
  const id = React.useId()

  return <video data-id={id} {...restVideoProps} />
}

export default MemeVideo
