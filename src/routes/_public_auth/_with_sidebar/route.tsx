import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <div className="py-20 pb-10 sm:pt-28 min-h-screen">
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute('/_public_auth/_with_sidebar')({
  component: RouteComponent
})
