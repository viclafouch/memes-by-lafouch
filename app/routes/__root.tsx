import * as React from 'react'
import clsx from 'clsx'
import OnlyPortrait from 'src/components/OnlyPortrait'
import appCss from '~/styles/globals.css?url'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRoute,
  Outlet,
  ScrollRestoration
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Meta, Scripts } from '@tanstack/start'

const RootComponent = () => {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }
    ],
    links: [{ rel: 'stylesheet', href: appCss }]
  }),
  notFoundComponent: () => <h1>404 - Page Not Found</h1>,
  component: RootComponent
})

const queryClient = new QueryClient()

const RootDocument = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr">
      <head>
        <Meta />
      </head>
      <body
        className={clsx(
          'h-screen',
          'w-screen',
          'text-foreground',
          'bg-background'
        )}
      >
        <OnlyPortrait>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </OnlyPortrait>
        <ScrollRestoration />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
