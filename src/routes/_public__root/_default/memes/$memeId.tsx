import React from 'react'
import { formatDate } from 'date-fns'
import { ArrowLeft, Clapperboard, Download, Share2 } from 'lucide-react'
import ToggleLikeButton from '@/components/Meme/toggle-like-button'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { Title } from '@/components/ui/title'
import { useDownloadMeme } from '@/hooks/use-download-meme'
import { useShareMeme } from '@/hooks/use-share-meme'
import { buildVideoImageUrl } from '@/lib/bunny'
import { getMemeByIdQueryOpts } from '@/lib/queries'
import { buildMemeSeo } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

const RouteComponent = () => {
  const { memeId } = Route.useParams()
  const memeQuery = useSuspenseQuery(getMemeByIdQueryOpts(memeId))
  const meme = memeQuery.data

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
                src={`https://iframe.mediadelivery.net/embed/471900/${meme.video.bunnyId}?autoplay=false&loop=false&muted=true&preload=false&responsive=true`}
                title={meme.title}
                className="w-full h-full z-10"
                allow="autoplay; fullscreen"
              />
            </div>
            <div className="flex justify-center md:justify-start gap-x-2 items-center">
              <h1 className="font-bricolage text-foreground max-w-4xl text-left font-semibold md:text-balance text-lg leading-[1.2] sm:text-xl lg:text-2xl">
                {meme.title}
              </h1>
              <ToggleLikeButton meme={meme} />
            </div>
          </div>
          <div className="w-full flex flex-col gap-y-4 max-w-md md:max-w-none mx-auto items-center md:items-start">
            <div className="flex flex-col gap-y-2.5 w-full">
              <LoadingButton
                isLoading={shareMutation.isPending}
                variant="outline"
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
              <Link
                to="/studio/$memeId"
                params={{ memeId: meme.id }}
                className={cn(buttonVariants({ variant: 'default' }))}
              >
                <Clapperboard />
                Ouvrir dans Studio
              </Link>
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
    </div>
  )

  return (
    <div className="flex flex-1 flex-col items-center gap-6 w-full justify-center">
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-1">
          <span className="text-muted-foreground text-sm text-center">
            Ajouté le {formatDate(meme.createdAt, 'dd/MM/yyyy')}
          </span>
          <Title size="h2" className="max-w-2xl">
            {meme.title}
          </Title>
        </div>
        {allTags.length > 0 ? (
          <div className="flex justify-center flex-wrap gap-1.5 max-w-[500px] mx-auto">
            {allTags.map((tag) => {
              return (
                <Badge variant="secondary" key={tag}>
                  {tag.toLowerCase()}
                </Badge>
              )
            })}
          </div>
        ) : null}
      </div>
      <div className="max-w-[800px] mx-auto w-full">
        <div className="flex justify-center w-full">
          <div className="bg-muted relative aspect-video overflow-hidden rounded-lg text-sm border border-white/10 w-full">
            <iframe
              src={`https://iframe.mediadelivery.net/embed/471900/${meme.video.bunnyId}?autoplay=false&loop=false&muted=true&preload=true&responsive=true`}
              title={meme.title}
              className="w-full h-full"
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_public__root/_default/memes/$memeId')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
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
