'use client'

import React from 'react'
import { downloadBlob } from '@/utils/download'
import { Button } from '@nextui-org/react'
import { DownloadSimple } from '@phosphor-icons/react'
import { Meme } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export type DownloadMemeButtonProps = {
  meme: Meme
}

const DownloadMemeButton = ({ meme }: DownloadMemeButtonProps) => {
  const downloadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(meme.videoUrl)

      return response.blob()
    },
    onSuccess: (blob) => {
      downloadBlob(blob, meme.title)
    }
  })

  const handleDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (downloadMutation.isPending) {
      return
    }

    downloadMutation.mutate()
  }

  return (
    <Button
      isLoading={downloadMutation.isPending}
      isIconOnly
      color="primary"
      onClick={handleDownload}
      aria-label="Télécharger"
    >
      <DownloadSimple fontSize={20} />
    </Button>
  )
}

export default DownloadMemeButton
