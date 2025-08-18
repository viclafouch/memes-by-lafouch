import React from 'react'
import { Share2 } from 'lucide-react'
import { IconButton } from '@/components/animate-ui/buttons/icon'
import type { MemeWithVideo } from '@/constants/meme'
import { useShareMeme } from '@/hooks/use-share-meme'

type ShareMemeButtonProps = {
  meme: MemeWithVideo
  className?: string
}

export const ShareMemeButton = ({ meme, className }: ShareMemeButtonProps) => {
  const shareMutation = useShareMeme()

  const handleShare = () => {
    if (shareMutation.isPending) {
      return
    }

    shareMutation.mutate(meme)
  }

  return (
    <IconButton
      icon={Share2}
      active={shareMutation.isPending}
      onClick={handleShare}
      className={className}
    />
  )
}
