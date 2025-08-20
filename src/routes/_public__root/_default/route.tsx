import { Container } from '@/components/ui/container'
import { getFavoritesMemesQueryOpts } from '@/lib/queries'
import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <div className="py-20 pb-10 sm:pt-28 min-h-screen">
      <Container>
        <Outlet />
      </Container>
    </div>
  )
}

export const Route = createFileRoute('/_public__root/_default')({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.user) {
      context.queryClient.fetchQuery(getFavoritesMemesQueryOpts())
    }
  }
})
