import React from 'react'
import { toast } from 'sonner'
import { Sheet, SheetTrigger } from '@/components/animate-ui/radix/sheet'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import ToggleLikeButton from '@/components/Meme/toggle-like-button'
import { StudioDialogExport } from '@/components/studio/studio-dialog-export'
import { StudioMobileSheet } from '@/components/studio/studio-mobile-sheet'
import { StudioTabs } from '@/components/studio/studio-tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/spinner'
import {
  useVideoInitializer,
  useVideoProcessor
} from '@/hooks/use-video-processor'
import { getMemeByIdQueryOpts } from '@/lib/queries'
import { buildMemeSeo } from '@/lib/seo'
import { createFileRoute } from '@tanstack/react-router'
import { PageDescription, PageHeading } from '../../-components/page-headers'

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
      onError: () => {
        setIsDialogOpened(false)
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
    <div className="w-full flex flex-col gap-y-8">
      <div className="text-center flex flex-col items-center justify-center px-4">
        <PageHeading>Studio</PageHeading>
        <PageDescription className="lg:max-w-3xl">
          A large collection of admin dashboards, website templates, UI
          components, and ready-to-use blocks. Save time and deliver projects
          faster.
        </PageDescription>
      </div>
      <div className="grid lg:grid-cols-[auto_350px] h-full overflow-hidden">
        <div className="w-full flex flex-col gap-4 p-4">
          <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
            <iframe
              src={`https://iframe.mediadelivery.net/embed/471900/${meme.video.bunnyId}?preload=false&autoplay=false`}
              loading="eager"
              title={meme.title}
              className="w-full h-full"
              allow="autoplay"
            />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-start justify-between gap-x-6">
              <h1 className="text-xl">{meme.title}</h1>
              <div className="flex items-center gap-x-2 shrink-0">
                <ToggleLikeButton meme={meme} />
                <ShareMemeButton meme={meme} />
              </div>
            </div>
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
        <div className="p-4 h-full overflow-hidden hidden lg:block">
          <div className="max-h-52 overflow-hidden">
            <StudioTabs />
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_public__root/_default/studio/$memeId')({
  component: RouteComponent,
  ssr: 'data-only',
  pendingComponent: () => {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  },
  pendingMs: 2000,
  loader: async ({ context, params }) => {
    const meme = await context.queryClient.ensureQueryData(
      getMemeByIdQueryOpts(params.memeId)
    )

    return {
      meme
    }
  },
  head: ({ loaderData }) => {
    if (loaderData?.meme) {
      return {
        meta: [...buildMemeSeo(loaderData.meme)]
      }
    }

    return {}
  }
})
