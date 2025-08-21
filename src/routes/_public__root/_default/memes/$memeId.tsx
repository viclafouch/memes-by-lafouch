import React from 'react'
import { formatDate } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Title } from '@/components/ui/title'
import { getMemeByIdQueryOpts } from '@/lib/queries'
import { buildMemeSeo } from '@/lib/seo'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { memeId } = Route.useParams()
  const memeQuery = useSuspenseQuery(getMemeByIdQueryOpts(memeId))
  const meme = memeQuery.data

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
