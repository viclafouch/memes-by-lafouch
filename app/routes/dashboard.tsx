import WithDrawer from '~/components/WithDrawer'
import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <WithDrawer>
      <Outlet />
    </WithDrawer>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent
})
