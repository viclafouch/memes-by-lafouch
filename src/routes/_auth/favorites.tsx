import { MemesList } from '@/components/Meme/memes-list'
import { getFavoritesMemes } from '@/server/user'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const loaderData = Route.useLoaderData()

  return <MemesList layoutContext="favorites" memes={loaderData.memes} />
}

export const Route = createFileRoute('/_auth/favorites')({
  component: RouteComponent,
  loader: async () => {
    const memes = await getFavoritesMemes()

    return {
      crumb: 'Favoris',
      memes
    }
  }
})
