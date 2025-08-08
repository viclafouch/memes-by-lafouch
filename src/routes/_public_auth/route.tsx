import { StarsBackground } from '@/components/animate-ui/backgrounds/stars'
import { Footer } from '@/components/footer'
import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <StarsBackground>
      <Outlet />
      <Footer />
    </StarsBackground>
  )
}

export const Route = createFileRoute('/_public_auth')({
  component: RouteComponent
})
