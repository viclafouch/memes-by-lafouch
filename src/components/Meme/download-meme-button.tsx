import React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { MemeWithVideo } from '@/constants/meme'
import { useDownload } from '@/hooks/useDownload'
import { incrementDownloadCount } from '@/server/meme'
import { getFilenameExtension } from '@/utils/file'

type DownloadMemeButtonProps = {
  meme: MemeWithVideo
} & Partial<React.ComponentProps<typeof Button>>

export const DownloadMemeButton = ({
  meme,
  ...restButtonProps
}: DownloadMemeButtonProps) => {
  const downloadMutation = useDownload()

  const handleDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (downloadMutation.isPending) {
      return
    }

    const extension = getFilenameExtension(meme.video.src)

    try {
      downloadMutation.mutateAsync({
        filename: `${meme.title}.${extension}`,
        url: meme.video.src
      })
      incrementDownloadCount({ data: meme.id })
    } catch (error) {
      toast.error('Une erreur est survenue')
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={downloadMutation.isPending}
      type="button"
      aria-label="Télécharger"
      {...restButtonProps}
    />
  )
}
