import React from 'react'
import { Button } from '@/components/ui/button'
import type { MemeWithVideo } from '@/constants/meme'
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
      // TODO: backend side
      const videoURL = `https://vz-eb732fb9-3bc.b-cdn.net/${meme.video.bunnyId}/original`
      const response = await fetch(videoURL)
      const blob = await response.blob()

      const data: ShareData = {
        files: [new File([blob], `${meme.title}.mp4`, { type: blob.type })],
        title: meme.title
      }

      await navigator.share(data).catch(() => {})
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
