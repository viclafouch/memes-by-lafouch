'use client'

import React from 'react'
import { downloadBlob } from '@/utils/download'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@nextui-org/react'
import { DownloadSimple } from '@phosphor-icons/react/dist/ssr'
import type { Meme } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export type MemeListItemProps = {
  meme: Meme
}

const MemeListItem = ({ meme }: MemeListItemProps) => {
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
    <Card className="py-4" key={meme.id}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{meme.title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <video
          controls
          className="w-full object-cover rounded-xl"
          src={meme.videoUrl}
          width={270}
          preload="metadata"
          height={200}
        />
      </CardBody>
      <CardFooter>
        <Button
          isLoading={downloadMutation.isPending}
          isIconOnly
          color="primary"
          onClick={handleDownload}
          aria-label="Télécharger"
        >
          <DownloadSimple fontSize={20} />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default MemeListItem
