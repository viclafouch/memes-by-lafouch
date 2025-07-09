import React from 'react'
import { Button } from '@/components/ui/button'
import type { MemeWithVideo } from '@/constants/meme'
import { incrementDownloadCount } from '@/server/meme'
import { useMutation } from '@tanstack/react-query'

type ShareMemeButtonProps = {
  meme: MemeWithVideo
} & Partial<React.ComponentProps<typeof Button>>

export const ShareMemeButton = ({
  meme,
  ...restButtonProps
}: ShareMemeButtonProps) => {
  const shareMutation = useMutation({
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
    },
    onSuccess: () => {
      incrementDownloadCount({ data: meme.id })
    }
  })

  const handleDownload = () => {
    if (shareMutation.isPending) {
      return
    }

    shareMutation.mutate()
  }

  return (
    <Button
      color="secondary"
      disabled={shareMutation.isPending}
      onClick={handleDownload}
      type="button"
      aria-label="Partager"
      {...restButtonProps}
    />
  )
}
