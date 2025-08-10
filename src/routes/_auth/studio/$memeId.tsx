import React from 'react'
import { toast } from 'sonner'
import { Sheet, SheetTrigger } from '@/components/animate-ui/radix/sheet'
import { StudioDialogExport } from '@/components/studio/studio-dialog-export'
import { StudioMobileSheet } from '@/components/studio/studio-mobile-sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/spinner'
import {
  useVideoInitializer,
  useVideoProcessor
} from '@/hooks/use-video-processor'
import { getMemeByIdQueryOpts } from '@/lib/queries'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { meme } = Route.useLoaderData()
  const { data: ffmpeg } = useVideoInitializer()
  const [text, setText] = React.useState('')
  const [isDialogOpened, setIsDialogOpened] = React.useState(false)

  const { progress, processVideo, isLoading, data } = useVideoProcessor(
    ffmpeg,
    {
      onMutate: () => {
        setIsDialogOpened(true)
      },
      onError: (error) => {
        setIsDialogOpened(false)
        toast.error(error.message)
      }
    }
  )

  const handleInitialize = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!text.trim()) {
      toast.error('Veuillez saisir du texte')

      return
    }

    processVideo({ meme, text })
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
          <div className="flex gap-2">
            <Button
              disabled={text.trim().length === 0 || isLoading}
              type="submit"
            >
              Prévisualiser la vidéo
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="lg:hidden">
                  Choisir un autre mème
                </Button>
              </SheetTrigger>
              <StudioMobileSheet />
            </Sheet>
          </div>
        </form>
      </div>
      <StudioDialogExport
        open={isDialogOpened}
        onOpenChange={setIsDialogOpened}
        progress={progress}
        isLoading={isLoading}
        data={data}
      />
    </div>
  )
}

export const Route = createFileRoute('/_auth/studio/$memeId')({
  component: RouteComponent,
  ssr: 'data-only',
  pendingComponent: () => {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  },
  loader: async ({ context, params }) => {
    const meme = await context.queryClient.ensureQueryData(
      getMemeByIdQueryOpts(params.memeId)
    )

    return {
      crumb: `Studio - ${meme.title}`,
      meme
    }
  }
})
