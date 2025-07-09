import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { createFileRoute, redirect } from '@tanstack/react-router'

const Home = () => {
  const { data: session } = authClient.useSession()

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await authClient.signOut()
  }

  const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await authClient.signIn.social({
      provider: 'twitter'
    })
  }

  return (
    <main className="min-h-dvh w-screen flex items-center justify-center flex-col gap-y-4 p-4">
      <img
        className="max-w-sm w-full"
        src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/src/images/splash-dark.png"
        alt="TanStack Logo"
      />
      {session ? session.user.email : ''}
      {session ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <Button onClick={handleSignIn}>Login</Button>
      )}
      <h1>
        <span className="line-through">Next.js</span> TanStack Start
      </h1>
      <a
        className="bg-foreground text-background rounded-full px-4 py-1 hover:opacity-90"
        href="https://tanstack.com/start/latest"
        target="_blank"
        rel="noreferrer"
      >
        Docs
      </a>
    </main>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
  beforeLoad: async ({ location, context }) => {
    if (!context.user) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }

    throw redirect({ to: '/library' })
  }
})
