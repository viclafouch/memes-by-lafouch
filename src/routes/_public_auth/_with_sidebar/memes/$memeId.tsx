import React from 'react'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import { PageHeader } from '@/components/page-header'
import { Container } from '@/components/ui/container'
import { getMemeByIdQueryOpts } from '@/lib/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { memeId } = Route.useParams()
  const memeQuery = useSuspenseQuery(getMemeByIdQueryOpts(memeId))
  const meme = memeQuery.data

  return (
    <Container>
      <PageHeader
        title={meme.title}
        description={`${meme.viewCount} vue${meme.viewCount > 1 ? 's' : ''}`}
        action={
          <div className="flex gap-2 flex-wrap justify-end">
            <ShareMemeButton meme={meme} />
          </div>
        }
      />
      <div className="py-10">
        <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
          <iframe
            src={`https://iframe.mediadelivery.net/embed/471900/${meme.video.bunnyId}?autoplay=false&loop=false&muted=true&preload=true&responsive=true`}
            title={meme.title}
            className="w-full h-full"
            allow="autoplay; fullscreen"
          />
        </div>
      </div>
    </Container>
  )
}

export const Route = createFileRoute(
  '/_public_auth/_with_sidebar/memes/$memeId'
)({
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
    return {
      meta: [
        {
          name: 'description',
          content: 'My App is a web application'
        },
        {
          title: loaderData?.meme.title
        }
      ]
    }
  }
})
