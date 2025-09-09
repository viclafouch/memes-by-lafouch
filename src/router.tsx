import isNetworkError from 'is-network-error'
import { toast } from 'sonner'
import { DefaultLoading } from '@/components/default-loading'
import { ErrorComponent } from '@/components/error-component'
import { NotFound } from '@/components/not-found'
import { getErrorMessage } from '@/lib/auth-client'
import { MutationCache, QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

const mutationCache = new MutationCache({
  onError: (error: unknown) => {
    if (isNetworkError(error)) {
      toast.error('Veuillez vérifier votre connexion internet')
    } else if (error instanceof Error) {
      toast.error(getErrorMessage(error, 'fr'))
    }
  }
})

export function createAppRouter() {
  const queryClient = new QueryClient({
    mutationCache,
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        staleTime: 1000 * 60 * 2
      }
    }
  })

  const router = createRouter({
    routeTree,
    context: { queryClient, user: null },
    defaultPreloadStaleTime: 30_000, // 30s,
    defaultStaleTime: 30_000, // 30s,
    defaultPendingMs: 0,
    defaultViewTransition: false,
    notFoundMode: 'root',
    defaultPendingComponent: DefaultLoading,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: ({ error }) => {
      return <ErrorComponent error={error} />
    },
    defaultPreload: 'intent',
    scrollRestoration: true
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
