/// <reference types="vite/client" />
import React from 'react'
import type { UserWithRole } from 'better-auth/plugins'
import { OnlyPortrait } from '@/components/only-portrait'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import {
  getActiveSubscriptionQueryOpts,
  getAuthUserQueryOpts,
  getCategoriesListQueryOpts,
  getFavoritesMemesQueryOpts
} from '@/lib/queries'
import { seo } from '@/lib/seo'
import type { getAuthUser } from '@/server/user-auth'
import { DialogProvider } from '@/stores/dialog.store'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts
} from '@tanstack/react-router'
import appCss from '../styles.css?url'

const TanStackQueryDevtools =
  process.env.NODE_ENV === 'production'
    ? () => {
        return null
      }
    : React.lazy(async () => {
        const result = await import(
          '@tanstack/react-query-devtools/build/modern/production.js'
        )

        return { default: result.ReactQueryDevtools }
      })

const SpeedInsights =
  process.env.NODE_ENV === 'production'
    ? () => {
        return null
      }
    : React.lazy(async () => {
        const result = await import('@vercel/speed-insights/react')

        return { default: result.SpeedInsights }
      })

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => {
        return null
      }
    : React.lazy(async () => {
        const result = await import('@tanstack/react-router-devtools')

        return { default: result.TanStackRouterDevtools }
      })

const RootDocument = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr">
      <head>
        <meta name="algolia-site-verification" content="57C07DF31C29F6D0" />
        <HeadContent />
        <script
          type="text/javascript"
          src="//cdn.embed.ly/player-0.1.0.min.js"
        />
      </head>
      <body className="dark">
        <OnlyPortrait>
          <DialogProvider>{children}</DialogProvider>
        </OnlyPortrait>
        <Toaster richColors />
        <React.Suspense>
          <TanStackRouterDevtools position="bottom-left" />
          <TanStackQueryDevtools buttonPosition="bottom-right" />
          <SpeedInsights />
        </React.Suspense>
        <TailwindIndicator />
        <Scripts />
      </body>
    </html>
  )
}

const RootComponent = () => {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  user: Awaited<ReturnType<typeof getAuthUser>>
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(getAuthUserQueryOpts())

    if (user) {
      context.queryClient.fetchQuery(getFavoritesMemesQueryOpts())
      context.queryClient.fetchQuery(getActiveSubscriptionQueryOpts())
    }

    context.queryClient.fetchQuery(getCategoriesListQueryOpts())

    return { user: user as UserWithRole | null }
  },
  head: () => {
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        ...seo({
          title: 'Memes By Lafouch',
          description:
            'Memes By Lafouch est un site web qui contient des mèmes générés aléatoirement par l’utilisateur. De plus, il permet de télécharger des mèmes vidéo depuis des tweets.'
        })
      ],
      links: [{ rel: 'stylesheet', href: appCss }]
    }
  },
  component: RootComponent
})
