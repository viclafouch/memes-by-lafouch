import { MemesList } from '@/components/Meme/memes-list'
import { getFavoritesMemes } from '@/server/user'
import { createFileRoute, redirect } from '@tanstack/react-router'

const RouteComponent = () => {
  const loaderData = Route.useLoaderData()

  return <MemesList layoutContext="favorites" memes={loaderData.memes} />
}

export const Route = createFileRoute('/_public__root/_default/favorites')({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/memes' })
    }

    const memes = await getFavoritesMemes()

    return {
      memes
    }
  }
})
