import React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { MemeWithVideo } from '@/constants/meme'
import { useDownload } from '@/hooks/useDownload'
import { getMemeByIdQueryOpts } from '@/lib/queries'
import { incrementDownloadCount } from '@/server/meme'
import { stringToFilename } from '@/utils/string'
import { useQueryClient } from '@tanstack/react-query'

type DownloadMemeButtonProps = {
  meme: MemeWithVideo
} & Partial<React.ComponentProps<typeof Button>>

export const DownloadMemeButton = ({
  meme,
  ...restButtonProps
}: DownloadMemeButtonProps) => {
  const downloadMutation = useDownload()
  const queryClient = useQueryClient()

  const handleDownload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (downloadMutation.isPending) {
      return
    }

    const videoURL = ''

    throw new Error('CANNOT DOWNLOAD ANYMORE')

    try {
      downloadMutation.mutateAsync({
        filename: `${stringToFilename(meme.title)}.mp4`,
        url: videoURL
      })
      await incrementDownloadCount({ data: meme.id })
      queryClient.invalidateQueries(getMemeByIdQueryOpts(meme.id))
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
