'use client'

import React from 'react'
import { MemeWithVideo } from '@/constants/meme'
import { Button, ButtonProps } from '@nextui-org/react'

export type ShareMemeButtonProps = {
  meme: MemeWithVideo
  incrementDownloadCount: (memeId: MemeWithVideo['id']) => void
  children: React.ReactNode
} & Partial<ButtonProps>

const ShareMemeButton = ({
  meme,
  incrementDownloadCount,
  children,
  ...restButtonProps
}: ShareMemeButtonProps) => {
  const handleDownload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    try {
      const response = await fetch(meme.video.src)
      const blob = await response.blob()

      const data: ShareData = {
        files: [
          new File([blob], `${meme.title}.mp4`, {
            type: blob.type
          })
        ],
        title: meme.title
      }

      await navigator.share(data)
      incrementDownloadCount(meme.id)
    } catch (error) {
      //
    }
  }

  return (
    <Button
      color="primary"
      onClick={handleDownload}
      aria-label="Partager"
      {...restButtonProps}
    >
      {children}
    </Button>
  )
}

export default ShareMemeButton
