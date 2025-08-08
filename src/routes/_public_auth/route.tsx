import { StarsBackground } from '@/components/animate-ui/backgrounds/stars'
import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <StarsBackground>
      <Outlet />
    </StarsBackground>
  )
}

export const Route = createFileRoute('/_public_auth')({
  component: RouteComponent
})
