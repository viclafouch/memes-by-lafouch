'use client'

import React from 'react'
import type { MemeWithVideo } from '@/constants/meme'
import { useDownload } from '@/hooks/useDownload'
import { incrementDownloadCount } from '@/serverActions/incrementDownloadCount'
import { getFilenameExtension } from '@/utils/file'
import type { ButtonProps } from '@heroui/react'
import { Button } from '@heroui/react'

export type DownloadMemeButtonProps = {
  meme: MemeWithVideo
  children: React.ReactNode
} & Partial<ButtonProps>

const DownloadMemeButton = ({
  meme,
  children,
  ...restButtonProps
}: DownloadMemeButtonProps) => {
  const { mutate: download, isPending } = useDownload()

  const handleDownload = () => {
    if (isPending) {
      return
    }

    const extension = getFilenameExtension(meme.video.src)

    download(
      {
        filename: `${meme.title}.${extension}`,
        url: meme.video.src
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
      onPress={handleDownload}
      type="button"
      aria-label="Télécharger"
      {...restButtonProps}
    >
      {children}
    </Button>
  )
}

export default DownloadMemeButton
