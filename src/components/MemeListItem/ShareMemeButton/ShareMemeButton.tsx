'use client'

import React from 'react'
import { MemeWithVideo } from '@/constants/meme'
import { Button, ButtonProps } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'

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
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
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
    }
  })

  const handleDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isPending) {
      return
    }

    mutate()
  }

  return (
    <Button
      color="secondary"
      isDisabled={isPending}
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      onClick={handleDownload}
      aria-label="Partager"
      {...restButtonProps}
    >
      {children}
    </Button>
  )
}

export default ShareMemeButton
