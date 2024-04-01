'use client'

import React from 'react'
import { useDownload } from '@/hooks/useDownload'
import { Button, ButtonProps } from '@nextui-org/react'
import { Meme } from '@prisma/client'

export type DownloadMemeButtonProps = {
  meme: Meme
  children: React.ReactNode
} & Partial<ButtonProps>

const DownloadMemeButton = ({
  meme,
  children,
  ...restButtonProps
}: DownloadMemeButtonProps) => {
  const { mutate: download, isPending } = useDownload()

  const handleDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isPending) {
      return
    }

    download({
      filename: meme.title,
      url: meme.videoUrl
    })
  }

  return (
    <Button
      isLoading={isPending}
      color="primary"
      onClick={handleDownload}
      aria-label="Télécharger"
      {...restButtonProps}
    >
      {children}
    </Button>
  )
}

export default DownloadMemeButton
