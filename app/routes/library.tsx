import prisma from 'src/db'
import MemeCard from '~/components/MemeCard/MemeCard'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

const getMemes = createServerFn({
  method: 'GET'
}).handler(async () => {
  return await prisma.meme.findMany({
    include: {
      video: true
    }
  })
})

const RouteComponent = () => {
  const memes = Route.useLoaderData()

  memes.length = 10

  return (
    <div>
      <div className="py-4 grid w-full gap-5 grid-cols-4">
        {memes.map((meme) => {
          return <MemeCard key={meme.id} meme={meme} />
        })}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/library')({
  component: RouteComponent,
  loader: () => getMemes()
})
