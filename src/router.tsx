import isNetworkError from 'is-network-error'
import { toast } from 'sonner'
import { DefaultLoading } from '@/components/default-loading'
import { ErrorComponent } from '@/components/error-component'
import { NotFound } from '@/components/not-found'
import { MutationCache, QueryClient } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { routeTree } from './routeTree.gen'

const mutationCache = new MutationCache({
  onError: (error: unknown) => {
    if (isNetworkError(error)) {
      toast.error('Veuillez vérifier votre connexion internet')
    } else if (error instanceof Error) {
      toast.error(error.message)
    }
  }
})

export function createRouter() {
  const queryClient = new QueryClient({
    mutationCache
  })

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient, user: null },
      defaultPreloadStaleTime: 0,
      defaultStaleTime: 0,
      defaultViewTransition: true,
      notFoundMode: 'root',
      defaultPendingComponent: DefaultLoading,
      defaultNotFoundComponent: NotFound,
      defaultErrorComponent: ({ error }) => {
        return <ErrorComponent error={error} />
      },
      defaultPreload: 'intent'
    }),
    queryClient
  )
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
