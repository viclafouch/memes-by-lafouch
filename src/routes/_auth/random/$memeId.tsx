import React from 'react'
import { Share, Shuffle } from 'lucide-react'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { getMemeById, getRandomMeme } from '@/server/meme'
import {
  createFileRoute,
  notFound,
  rootRouteId,
  useRouter
} from '@tanstack/react-router'

const RouteComponent = () => {
  const loaderData = Route.useLoaderData()
  const router = useRouter()
  const { meme, nextRandomMeme } = loaderData
  const navigate = Route.useNavigate()

  React.useEffect(() => {
    async function preload() {
      try {
        const nextMeme = await nextRandomMeme
        await router.preloadRoute({
          to: '/random/$memeId',
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
      navigate({ to: `/random/${newMeme.id}` })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  return (
    <Container>
      <div className="flex flex-col items-center gap-6">
        <div className="py-10 w-full max-w-4xl">
          <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
            <iframe
              src={`https://iframe.mediadelivery.net/embed/471900/${meme.video.bunnyId}?autoplay=true&loop=false&muted=true&preload=true&responsive=true"`}
              loading="lazy"
              title={meme.title}
              className="w-full h-full"
              sandbox="allow-scripts"
            />
          </div>
        </div>
        <div className="flex gap-4 flex-col w-full items-center max-w-96">
          <div className="flex gap-4">
            <ShareMemeButton meme={meme} size="lg" variant="secondary">
              <Share />
              Partager
            </ShareMemeButton>
            <Button size="lg" onClick={goToNextRandomMeme}>
              <Shuffle />
              Aléatoire
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}

export const Route = createFileRoute('/_auth/random/$memeId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const meme = await getMemeById({ data: params.memeId })

    if (!meme) {
      throw notFound({ routeId: rootRouteId })
    }

    const nextRandomMeme = getRandomMeme({ data: meme.id })

    return {
      meme,
      nextRandomMeme,
      crumb: meme.title
    }
  }
})
