import React from 'react'
import { toast } from 'sonner'
import { Progress } from '@/components/animate-ui/radix/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useVideoInitializer,
  useVideoProcessor
} from '@/hooks/use-video-processor'
import { getMemeByIdQueryOpts } from '@/lib/queries'
import { shareMeme } from '@/server/meme'
import { downloadBlob } from '@/utils/download'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { meme } = Route.useLoaderData()
  const { data: ffmpeg } = useVideoInitializer()
  const [text, setText] = React.useState('')

  const { progress, processVideo, isLoading } = useVideoProcessor(ffmpeg, {
    onSuccess: (blob) => {
      downloadBlob(blob, 'meme.mp4')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleInitialize = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!text.trim()) {
      toast.error('Veuillez saisir du texte')

      return
    }

    const response = await shareMeme({ data: meme.id })
    processVideo({
      videoBlob: await response.blob(),
      text
    })
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
        <iframe
          src={`https://iframe.mediadelivery.net/embed/471900/${meme.video.bunnyId}?preload=false&autoplay=false`}
          loading="eager"
          title={meme.title}
          className="w-full h-full"
          allow="autoplay"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl">Ajouter du texte</h1>
        <form
          className="max-w-xl flex flex-col gap-4 items-start"
          onSubmit={handleInitialize}
        >
          <Input
            value={text}
            onChange={(event) => {
              setText(event.target.value)
            }}
            placeholder="Texte à ajouter"
            name="text"
            type="text"
          />
          <Button
            disabled={text.trim().length === 0 || isLoading}
            type="submit"
          >
            Prévisualiser la vidéo
          </Button>
        </form>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <span>{progress}%</span>
            <Progress value={progress} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_auth/studio/$memeId')({
  component: RouteComponent,
  ssr: 'data-only',
  loader: async ({ context, params }) => {
    const meme = await context.queryClient.ensureQueryData(
      getMemeByIdQueryOpts(params.memeId)
    )

    return {
      meme
    }
  }
})
