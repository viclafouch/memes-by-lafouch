'use client'

import React from 'react'
import { useDownload } from '@/hooks/useDownload'
import { incrementDownloadCount } from '@/serverActions/incrementDownloadCount'
import { getFilenameExtension } from '@/utils/file'
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

    const extension = getFilenameExtension(meme.videoUrl)

    download(
      {
        filename: `${meme.title}.${extension}`,
        url: meme.videoUrl
      },
      {
        onSuccess: () => {
          incrementDownloadCount(meme.id)
        }
      }
    )
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
