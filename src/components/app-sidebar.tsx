import { Download, Home, Shuffle, User2 } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

const items = [
  {
    title: 'Librairie',
    to: '/library',
    icon: Home
  },
  {
    title: 'Téléchargeur',
    to: '/downloader',
    icon: Download
  },
  {
    title: 'Aléatoire',
    to: '/random',
    icon: Shuffle
  }
] satisfies ({
  title: string
} & LinkProps & {
    icon: React.ComponentType<React.ComponentProps<'svg'>>
  })[]

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
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
              {items.map(({ title, icon: Icon, ...linkProps }) => {
                return (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton asChild>
                      <Link {...linkProps}>
                        <Icon />
                        <span>{title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
