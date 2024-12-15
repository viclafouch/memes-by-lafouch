'use client'

import React from 'react'
import { MemeWithVideo } from '@/constants/meme'
import { useDownload } from '@/hooks/useDownload'
import { incrementDownloadCount } from '@/serverActions/incrementDownloadCount'
import { getFilenameExtension } from '@/utils/file'
import { Button, ButtonProps } from '@nextui-org/react'

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

  const handleDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

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
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      onClick={handleDownload}
      aria-label="Télécharger"
      {...restButtonProps}
    >
      {children}
    </Button>
  )
}

export default DownloadMemeButton
