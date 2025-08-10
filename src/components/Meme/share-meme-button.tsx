import React from 'react'
import { Share2 } from 'lucide-react'
import { IconButton } from '@/components/animate-ui/buttons/icon'
import type { MemeWithVideo } from '@/constants/meme'
import { shareMeme } from '@/server/meme'
import { shareBlob } from '@/utils/download'
import { useMutation } from '@tanstack/react-query'

type ShareMemeButtonProps = {
  meme: MemeWithVideo
}

export const ShareMemeButton = ({ meme }: ShareMemeButtonProps) => {
  const shareMutation = useMutation({
    mutationFn: async () => {
      const response = await shareMeme({ data: meme.id })
      const blob = await response.blob()

      shareBlob(blob, meme.title)
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
