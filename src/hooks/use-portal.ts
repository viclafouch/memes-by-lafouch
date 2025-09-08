import { toast } from 'sonner'
import { PRODUCT_ID } from '@/constants/polar'
import { authClient } from '@/lib/auth-client'
import { getActiveSubscriptionQueryOpts } from '@/lib/queries'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouteContext } from '@tanstack/react-router'

export const usePortal = () => {
  const { user } = useRouteContext({ from: '__root__' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const goToPortal = async () => {
    if (!user) {
      navigate({ to: '/login' })

      return
    }

    try {
      const promise = authClient.customer.portal()
      toast.promise(promise, { loading: 'Chargement...' })
      await promise
    } catch (error) {
      toast.error('Une erreur est survenue')
    }
  }

  const checkoutPortal = async () => {
    if (!user) {
      navigate({ to: '/login' })

      return
    }

    try {
      const promise = new Promise((resolve) => {
        // We force the toast to be a promise
        setTimeout(resolve, 1)
      })
        .then(() => {
          return queryClient.fetchQuery(getActiveSubscriptionQueryOpts())
        })
        .then(async (activeSubscription) => {
          if (!activeSubscription) {
            return authClient.checkout({ products: [PRODUCT_ID] })
          }

          return Promise.resolve(
            toast.success('Vous avez déjà un abonnement en cours !')
          )
        })

      toast.promise(promise, { loading: 'Chargement...' })

      await promise
    } catch (error) {
      toast.error('Une erreur est survenue')
    }
  }

  return {
    goToPortal,
    checkoutPortal
  }
}
