import { Download, Home, Shuffle, Stars, User2 } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { getFavoritesMemesCountQueryOpts } from '@/lib/queries'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const favoritesCountQuery = useQuery(getFavoritesMemesCountQueryOpts())

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/library">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <User2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Memes By Lafouch
                  </span>
                  <span className="truncate text-xs">Tableau de bord</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/library">
                    <Home />
                    <span>Librairie</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/downloader">
                    <Download />
                    <span>Téléchargeur</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/favorites">
                    <Stars />
                    <span>Mes favoris</span>
                    {favoritesCountQuery.data ? (
                      <SidebarMenuBadge>
                        {favoritesCountQuery.data.count}
                      </SidebarMenuBadge>
                    ) : null}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/random">
                    <Shuffle />
                    <span>Aléatoire</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
