'use client'

import React from 'react'
import { Button, ButtonProps } from '@nextui-org/react'
import { Meme } from '@prisma/client'

export type ShareMemeButtonProps = {
  meme: Meme
  children: React.ReactNode
} & Partial<ButtonProps>

const ShareMemeButton = ({
  meme,
  children,
  ...restButtonProps
}: ShareMemeButtonProps) => {
  const handleDownload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    try {
      const response = await fetch(meme.videoUrl)
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
