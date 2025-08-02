import React from 'react'
import { Share2 } from 'lucide-react'
import { IconButton } from '@/components/animate-ui/buttons/icon'
import type { MemeWithVideo } from '@/constants/meme'
import { useMutation } from '@tanstack/react-query'

type ShareMemeButtonProps = {
  meme: MemeWithVideo
}

export const ShareMemeButton = ({ meme }: ShareMemeButtonProps) => {
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

  const handleShare = () => {
    if (shareMutation.isPending) {
      return
    }

    shareMutation.mutate()
  }

  return (
    <IconButton
      icon={Share2}
      active={shareMutation.isPending}
      onClick={handleShare}
    />
  )
}
