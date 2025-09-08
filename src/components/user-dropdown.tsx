import React from 'react'
import type { UserWithRole } from 'better-auth/plugins'
import {
  ChevronDown,
  CreditCard,
  LogOutIcon,
  Shield,
  SparklesIcon,
  Star
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { usePortal } from '@/hooks/use-portal'
import { authClient, matchIsUserAdmin } from '@/lib/auth-client'
import {
  getActiveSubscriptionQueryOpts,
  getAuthUserQueryOpts,
  getFavoritesMemesCountQueryOpts
} from '@/lib/queries'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'

export const UserDropdown = ({ user }: { user: UserWithRole }) => {
  const [open, setOpen] = React.useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { goToPortal, checkoutPortal } = usePortal()

  const favoritesMemesCountQuery = useQuery(getFavoritesMemesCountQueryOpts())
  const activeSubscriptionQuery = useQuery(getActiveSubscriptionQueryOpts())

  const handleLogout = async () => {
    await authClient.signOut()
    queryClient.removeQueries(getAuthUserQueryOpts())
    queryClient.removeQueries(getActiveSubscriptionQueryOpts())
    await router.invalidate()
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 px-2">
          <Avatar className="size-6 rounded-lg">
            <AvatarImage
              src="https://bundui-images.netlify.app/avatars/01.png"
              alt={user.name}
            />
            <AvatarFallback className="rounded-lg">TB</AvatarFallback>
          </Avatar>
          <div className="truncate">{user.name}</div>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage
                src="https://bundui-images.netlify.app/avatars/01.png"
                alt={user.name}
              />
              <AvatarFallback className="rounded-lg">TB</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {activeSubscriptionQuery.data === null ? (
            <DropdownMenuItem
              onClick={() => {
                return checkoutPortal()
              }}
            >
              <SparklesIcon />
              Mettre à niveau
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                return goToPortal()
              }}
            >
              <CreditCard />
              Gérer mon abonnement
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/favorites">
              <Star />
              Favoris ({favoritesMemesCountQuery.data?.count ?? 0})
            </Link>
          </DropdownMenuItem>
          {matchIsUserAdmin(user) ? (
            <DropdownMenuItem asChild>
              <Link to="/admin">
                <Shield />
                Administration
              </Link>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600!">
          <LogOutIcon className="text-red-600!" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
