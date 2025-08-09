import { StudioTabs } from '@/components/studio/studio-tabs'
import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <div className="h-full border border-accent rounded-xl mb-4 overflow-hidden">
      <div className="grid grid-cols-[auto_350px] h-full overflow-hidden">
        <div className="p-4">
          <Outlet />
        </div>
        <div className="p-4 border-l border-accent h-full overflow-scroll">
          <div>
            <StudioTabs />
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_auth/studio')({
  component: RouteComponent
})
