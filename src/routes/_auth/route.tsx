import { AppSidebar } from '@/components/app-sidebar'
import { PathBreadcrumbs } from '@/components/path-breadcrumbs'
import { Container } from '@/components/ui/container'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { UserNavButton } from '@/components/User/user-nav-button'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)'
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Container>
          <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-4"
              />
              <PathBreadcrumbs />
            </div>
            <UserNavButton />
          </header>
          <Outlet />
        </Container>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  beforeLoad: async ({ location, context }) => {
    if (!context.user) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  }
})
