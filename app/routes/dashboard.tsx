import AuthLayout from '~/components/Layout/AuthLayout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent
})
