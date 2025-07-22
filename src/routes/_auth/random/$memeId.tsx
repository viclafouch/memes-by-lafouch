import React from 'react'
import { Share, Shuffle } from 'lucide-react'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { cloudinaryClient } from '@/lib/cloudinary-client'
import { getMemeById, getRandomMeme } from '@/server/meme'
import { Delivery } from '@cloudinary/url-gen/actions'
import { Format } from '@cloudinary/url-gen/qualifiers'
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

  const video = cloudinaryClient.video(meme.video.cloudinaryId)

  const thumbnailUrl = cloudinaryClient
    .video(meme.video.cloudinaryId)
    .addTransformation(`so_1s`)
    .delivery(Delivery.format(Format.avif()))
    .toURL()

  return (
    <Container>
      <div className="flex flex-col items-center gap-6">
        <div className="py-10 w-full max-w-4xl">
          <div className="relative w-full overflow-hidden lg:rounded-medium shadow-small flex flex-col gap-6">
            {/* Top Shadow */}
            <div className="hidden lg:block lg:absolute top-0 z-10 lg:h-32 w-full rounded-medium bg-gradient-to-b from-black/80 to-transparent" />
            <video
              src={video.toURL()}
              controls
              poster={thumbnailUrl}
              className="w-full aspect-video"
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
