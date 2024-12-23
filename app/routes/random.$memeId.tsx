import prisma from 'src/db'
import { myVideoLoader } from '~/utils/cloudinary'
import { Shuffle } from '@phosphor-icons/react'
import type { Meme } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import {
  createFileRoute,
  defer,
  notFound,
  useNavigate
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

const getMeme = createServerFn({
  method: 'GET'
})
  .validator((memeId: Meme['id']) => memeId)
  .handler(async ({ data }) => {
    const meme = await prisma.meme.findUnique({
      where: {
        id: data
      },
      include: {
        video: true
      }
    })

    if (!meme) {
      throw notFound()
    }

    return meme
  })

const getRandomMeme = createServerFn({
  method: 'GET'
})
  .validator((memeId: Meme['id']) => memeId)
  .handler(async ({ data }) => {
    const memes = await prisma.meme.findMany()
    const withoutCurrentMeme = memes.filter((meme) => {
      return meme.id !== data
    })

    const randomIndex = Math.floor(Math.random() * withoutCurrentMeme.length)

    const meme = withoutCurrentMeme[randomIndex]

    return meme
  })

const RouteComponent = () => {
  const { meme, deferredRandomMeme } = Route.useLoaderData()
  const navigate = useNavigate()

  const redirectRandomMemeMutation = useMutation({
    mutationFn: () => {
      return deferredRandomMeme
    },
    onSuccess: (randomMeme) => {
      navigate({
        to: '/random/$memeId',
        params: {
          memeId: randomMeme.id
        }
      })
    }
  })

  const handleGoRandomMeme = () => {
    redirectRandomMemeMutation.mutate()
  }

  return (
    <div className="pb-5 pt-10 h-full flex grow">
      <div className="flex flex-col items-center gap-6 grow">
        <h1 className="text-xl text-center lg:text-3xl">{meme.title}</h1>
        <div className="grow flex w-full max-w-[720px]">
          <div className="grow flex relative w-full">
            <video
              src={myVideoLoader({
                src: meme.video.src
              })}
              className="absolute h-full w-full object-contains inset-0"
              autoPlay
              controls
              onEnded={() => redirectRandomMemeMutation.mutate()}
              poster={meme.video.poster || undefined}
            />
          </div>
        </div>
        <div className="flex gap-4 flex-col w-full max-w-96">
          <button
            color="primary"
            type="submit"
            onClick={handleGoRandomMeme}
            className="btn btn-primary btn-lg"
          >
            {redirectRandomMemeMutation.isPending ? (
              <>
                <span className="loading loading-spinner" />
                Chargement...
              </>
            ) : (
              <>
                <Shuffle className="w-8 h-8" />
                Aléatoire
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/random/$memeId')({
  loader: async ({ params: { memeId } }) => {
    const meme = await getMeme({ data: memeId })

    const deferredRandomMeme = defer(getRandomMeme({ data: meme.id }))

    return {
      meme,
      deferredRandomMeme
    }
  },
  component: RouteComponent
})
