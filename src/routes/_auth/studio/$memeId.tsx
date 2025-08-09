import React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { getMemeByIdQueryOpts } from '@/lib/queries'
import { VideoProcessor } from '@/lib/video-processor'
import { shareMeme } from '@/server/meme'
import { downloadBlob } from '@/utils/download'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { meme } = Route.useLoaderData()
  const [progress, setProgress] = React.useState(0)

  const processor = React.useMemo(() => {
    return new VideoProcessor()
  }, [])

  const initializeMutation = useMutation({
    mutationFn: async () => {
      await processor.initialize((message) => {
        console.log(message)
      })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleInitialize = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    initializeMutation.mutate()
  }

  const processMutation = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      const response = await shareMeme({ data: meme.id })
      const blob = await response.blob()

      return processor.addTextBand({ videoBlob: blob, text }, setProgress)
    },
    onMutate: () => {
      setProgress(0)
    },
    onSuccess: (blob) => {
      downloadBlob(blob, 'meme.mp4')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  React.useEffect(() => {
    return () => {
      processor.ffmpeg.terminate()
    }
  }, [])

  const handleCreateMeme = () => {
    if (!processor.ffmpeg.loaded) {
      return
    }

    processMutation.mutate({
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate asperiores aliquid autem nulla perspiciatis quasi in nemo consectetur commodi mollitia. Corrupti consequatur aliquam blanditiis doloremque rem omnis incidunt quas quae.'
    })
  }

  return (
    <div className="relative w-full aspect-video">
      <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
        <iframe
          src={`https://iframe.mediadelivery.net/embed/471900/${meme.video.bunnyId}?preload=false&autoplay=false`}
          loading="eager"
          title={meme.title}
          className="w-full h-full"
          allow="autoplay"
        />
      </div>
      <div>
        {!processor.ffmpeg.loaded ? (
          <LoadingButton
            isLoading={initializeMutation.isPending}
            onClick={handleInitialize}
          >
            Initialize
          </LoadingButton>
        ) : (
          <div>
            <Button onClick={handleCreateMeme}>Create Meme</Button>
            <p>{progress}%</p>
          </div>
        )}
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
