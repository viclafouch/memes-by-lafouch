import React from 'react'
import { Share2 } from 'lucide-react'
import { IconButtonStars } from '@/components/animate-ui/buttons/icon-button-stars'
import type { MemeWithVideo } from '@/constants/meme'
import { useShareMeme } from '@/hooks/use-share-meme'

type ShareMemeButtonProps = {
  meme: MemeWithVideo
} & Partial<React.ComponentProps<typeof IconButtonStars>>

export const ShareMemeButton = ({
  meme,
  ...restProps
}: ShareMemeButtonProps) => {
  const shareMutation = useShareMeme()

  const handleShare = () => {
    if (shareMutation.isPending) {
      return
    }

    shareMutation.mutate(meme)
  }

  return (
    <IconButtonStars
      active={shareMutation.isPending}
      onClick={handleShare}
      {...restProps}
      icon={Share2}
    />
  )
}
