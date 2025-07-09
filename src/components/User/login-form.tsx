import { Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { useSearch } from '@tanstack/react-router'

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const search = useSearch({ from: '/login' })

  const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await authClient.signIn.social({
      provider: 'twitter',
      callbackURL: search.redirect || undefined
    })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bon retour !</CardTitle>
          <CardDescription>Login with your Twitter account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={handleSignIn}>
            {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
            <Twitter />
            Login with Twitter
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
