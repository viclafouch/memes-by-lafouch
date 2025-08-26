import React from 'react'
import { formatDate } from 'date-fns'
import {
  ArrowLeft,
  Clapperboard,
  Download,
  Pencil,
  Share2,
  Shuffle
} from 'lucide-react'
import { StudioDialog } from '@/components/Meme/studio-dialog'
import ToggleLikeButton from '@/components/Meme/toggle-like-button'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { useDownloadMeme } from '@/hooks/use-download-meme'
import { useShareMeme } from '@/hooks/use-share-meme'
import { matchIsUserAdmin } from '@/lib/auth-client'
import { buildVideoImageUrl } from '@/lib/bunny'
import { getMemeByIdQueryOpts } from '@/lib/queries'
import { buildMemeSeo } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { getRandomMeme } from '@/server/meme'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  ClientOnly,
  createFileRoute,
  Link,
  useRouteContext,
  useRouter
} from '@tanstack/react-router'

const RouteComponent = () => {
  const { nextRandomMeme } = Route.useLoaderData()
  const { user } = useRouteContext({ from: '__root__' })
  const { memeId } = Route.useParams()
  const navigate = Route.useNavigate()
  const router = useRouter()
  const memeQuery = useSuspenseQuery(getMemeByIdQueryOpts(memeId))
  const meme = memeQuery.data
  const [isStudioDialogOpened, setIsStudioDialogOpened] = React.useState(false)

  const shareMutation = useShareMeme()
  const downloadMutation = useDownloadMeme()

  const allTags = React.useMemo(() => {
    return [
      ...new Set([
        ...meme.categories.flatMap((category) => {
          return [category.category.title, ...category.category.keywords]
        }),
        ...meme.keywords
      ])
    ]
  }, [meme])

  React.useEffect(() => {
    async function preload() {
      try {
        const nextMeme = await nextRandomMeme
        await router.preloadRoute({
          to: '/memes/$memeId',
          params: {
            memeId: nextMeme.id
          }
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Failed to preload route')
      }
    }

    preload()
  }, [router, nextRandomMeme])

  const goToNextRandomMeme = async () => {
    try {
      const newMeme = await nextRandomMeme
      navigate({ to: '/memes/$memeId', params: { memeId: newMeme.id } })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-y-2 md:gap-y-4 items-start">
        <Link
          to="/memes"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
        >
          <ArrowLeft className="size-5" />
          <span>Retour aux memes</span>
        </Link>
        <div className="w-full grid md:grid-cols-[auto_300px] gap-x-2.5 gap-y-4">
          <div className="w-full flex flex-col gap-y-2 md:gap-y-2 items-center md:items-start">
            <div className="aspect-video w-full flex relative isolate border rounded-lg border-input overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-muted/50">
                <img
                  src={buildVideoImageUrl(meme.video.bunnyId)}
                  className="blur-2xl w-full h-full opacity-40 object-cover"
                  alt={meme.title}
                  loading="eager"
                />
              </div>
              <iframe
                src={`https://iframe.mediadelivery.net/embed/471900/${meme.video.bunnyId}?autoplay=true&muted=true&responsive=true`}
                title={meme.title}
                className="w-full h-full z-10"
                allow="autoplay; fullscreen"
                loading="eager"
              />
            </div>
            <div className="flex justify-center md:justify-start gap-x-2 items-center">
              <h1 className="font-bricolage text-foreground max-w-4xl text-left font-semibold md:text-balance text-lg leading-[1.2] sm:text-xl lg:text-2xl">
                {meme.title}
              </h1>
              <ToggleLikeButton meme={meme} />
              {user && matchIsUserAdmin(user) ? (
                <Link
                  className={buttonVariants({ size: 'icon', variant: 'ghost' })}
                  to="/admin/library/$memeId"
                  params={{ memeId: meme.id }}
                >
                  <Pencil />
                </Link>
              ) : null}
            </div>
          </div>
          <div className="w-full flex flex-col gap-y-4 max-w-md md:max-w-none mx-auto items-center md:items-start">
            <div className="flex flex-col gap-y-2.5 w-full">
              <LoadingButton
                isLoading={shareMutation.isPending}
                variant="outline"
                className="md:hidden"
                onClick={() => {
                  return shareMutation.mutate(meme)
                }}
              >
                <Share2 />
                Partager la vidéo
              </LoadingButton>
              <LoadingButton
                isLoading={downloadMutation.isPending}
                variant="outline"
                onClick={() => {
                  return downloadMutation.mutate(meme)
                }}
              >
                <Download />
                Télécharger la vidéo
              </LoadingButton>
              <Button onClick={goToNextRandomMeme}>
                <Shuffle />
                Aléatoire
              </Button>
              <Button
                variant="default"
                onClick={(event) => {
                  event.preventDefault()

                  setIsStudioDialogOpened(true)
                }}
              >
                <Clapperboard />
                Ouvrir dans Studio
              </Button>
            </div>
            {allTags.length > 0 ? (
              <div className="w-full flex justify-center md:justify-start flex-wrap gap-1.5 max-w-[500px] mx-auto">
                {allTags.map((tag) => {
                  return (
                    <Badge variant="secondary" key={tag}>
                      {tag.toLowerCase()}
                    </Badge>
                  )
                })}
              </div>
            ) : null}
            <div className="flex flex-col gap-y-1 text-center md:text-left">
              <span className="text-muted-foreground text-xs">
                Ajouté le {formatDate(meme.createdAt, 'dd/MM/yyyy')}
              </span>
              <span className="text-muted-foreground text-xs">
                {meme.viewCount} vues
              </span>
            </div>
          </div>
        </div>
      </div>
      <ClientOnly>
        <React.Suspense fallback={null}>
          <StudioDialog
            meme={meme}
            open={isStudioDialogOpened}
            onOpenChange={setIsStudioDialogOpened}
          />
        </React.Suspense>
      </ClientOnly>
    </div>
  )
}

export const Route = createFileRoute('/_public__root/_default/memes/$memeId')({
  component: RouteComponent,
  pendingMs: 1000,
  loader: async ({ params, context }) => {
    const meme = await context.queryClient.ensureQueryData(
      getMemeByIdQueryOpts(params.memeId)
    )

    const nextRandomMeme = getRandomMeme({ data: meme.id })

    return {
      meme,
      nextRandomMeme
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
