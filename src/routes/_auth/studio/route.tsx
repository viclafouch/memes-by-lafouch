import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <div className="lg:h-full border border-accent rounded-xl mb-4 overflow-hidden flex-1">
      <div className="h-full w-full">
        <Outlet />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_auth/studio')({
  component: RouteComponent
})
