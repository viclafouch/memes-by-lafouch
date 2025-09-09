import { MemesList } from '@/components/Meme/memes-list'
import { getFavoritesMemesQueryOpts } from '@/lib/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

const RouteComponent = () => {
  const favoritesMemeQuery = useSuspenseQuery(getFavoritesMemesQueryOpts())

  return (
    <MemesList
      layoutContext="favorites"
      memes={favoritesMemeQuery.data.bookmarks}
    />
  )
}

export const Route = createFileRoute('/_public__root/_default/favorites')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/memes' })
    }
  },
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(getFavoritesMemesQueryOpts())
  }
})
