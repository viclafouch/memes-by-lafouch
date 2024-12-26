import React from 'react'
import { MemeWithVideo } from 'src/constants/meme'
import { cn } from '~/utils/cn'
import { Share } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'

export type ShareMemeButtonProps = {
  meme: MemeWithVideo
} & React.ComponentProps<'button'>

const ShareMemeButton = ({
  meme,
  className,
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
    }
  })

  const handleDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (shareMutation.isPending) {
      return
    }

    shareMutation.mutate()
  }

  return (
    <button
      color="primary"
      type="button"
      className={cn('btn btn-sm btn-accent', className)}
      onClick={handleDownload}
      aria-label="Télécharger"
      {...restButtonProps}
    >
      <Share className="w-5 h-5" />
    </button>
  )
}

export default ShareMemeButton
