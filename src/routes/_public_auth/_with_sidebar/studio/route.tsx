import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <div className="container">
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute('/_public_auth/_with_sidebar/studio')({
  component: RouteComponent
})
