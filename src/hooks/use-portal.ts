import { toast } from 'sonner'
import { getActiveSubscriptionQueryOpts } from '@/lib/queries'
import { useShowDialog } from '@/stores/dialog.store'
import { useQueryClient } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'

export const useStripeCheckout = () => {
  const { user } = useRouteContext({ from: '__root__' })
  const showDialog = useShowDialog()
  const queryClient = useQueryClient()

  const goToPortal = async () => {
    if (!user) {
      showDialog('auth', {})
    }

    // try {
    //   const promise = authClient.customer.portal()
    //   toast.promise(promise, { loading: 'Chargement...' })
    //   await promise
    // } catch (error) {
    //   toast.error('Une erreur est survenue')
    // }
  }

  const checkoutPortal = async () => {
    if (!user) {
      showDialog('auth', {})

      return
    }

    try {
      const promise = new Promise((resolve) => {
        // We force the toast to be a promise
        setTimeout(resolve, 1)
      }).then(() => {
        return queryClient.fetchQuery(getActiveSubscriptionQueryOpts())
      })
      // .then(async (activeSubscription) => {
      //   if (!activeSubscription) {
      //     return authClient.subscription.upgrade({
      //       plan: 'premium',
      //       successUrl: `${window.location.origin}/checkout/toto`, // required
      //       cancelUrl: `${window.location.origin}/checkout/tata`, // required,
      //       disableRedirect: true
      //     })
      //   }

      //   return Promise.resolve(
      //     toast.success('Vous avez déjà un abonnement en cours !')
      //   )
      // })

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
