import { ResetPasswordForm } from '@/components/User/reset-password-form'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <div className="flex justify-center">
      <div className="min-w-md border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
        <ResetPasswordForm />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_public__root/_default/password/reset')({
  component: RouteComponent
})
