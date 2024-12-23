import React from 'react'
import type { MemeWithVideo } from 'src/constants/meme'
import prisma from 'src/db'
import { useDownload } from '~/hooks/useDownload'
import { cn } from '~/utils/cn'
import { getFilenameExtension } from '~/utils/file'
import { Download } from '@phosphor-icons/react'
import { Meme } from '@prisma/client'
import { createServerFn } from '@tanstack/start'

const incrementDownloadCount = createServerFn({
  method: 'POST'
})
  .validator((data: Pick<Meme, 'id'>) => data)
  .handler(async ({ data }: { data: Pick<Meme, 'id'> }) => {
    return await prisma.meme.update({
      where: {
        id: data.id
      },
      data: {
        downloadCount: {
          increment: 1
        }
      },
      select: {
        downloadCount: true
      }
    })
  })

export type DownloadMemeButtonProps = {
  meme: MemeWithVideo
  children: React.ReactNode
} & React.ComponentProps<'button'>

const DownloadMemeButton = ({
  meme,
  className,
  children,
  ...restButtonProps
}: DownloadMemeButtonProps) => {
  const downloadMutation = useDownload()

  const handleDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (downloadMutation.isPending) {
      return
    }

    const extension = getFilenameExtension(meme.video.src)

    downloadMutation.mutate(
      {
        filename: `${meme.title}.${extension}`,
        url: meme.video.src
      },
      {
        onSuccess: () => {
          incrementDownloadCount({
            data: {
              id: meme.id
            }
          })
        }
      }
    )
  }

  return (
    <button
      color="primary"
      type="button"
      className={cn('btn btn-sm btn-primary', className)}
      onClick={handleDownload}
      aria-label="Télécharger"
      {...restButtonProps}
    >
      {downloadMutation.isPending ? (
        <span className="loading loading-spinner" />
      ) : (
        <Download className="w-5 h-5" />
      )}
    </button>
  )
}

export default DownloadMemeButton
