import { polarClient } from '@/lib/auth'
import { getAuthUser } from '@/server/user-auth'
import { createServerFn } from '@tanstack/react-start'

export const getActiveSubscription = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await getAuthUser()

    if (!user) {
      return null
    }

    try {
      const state = await polarClient.customers.getStateExternal({
        externalId: user.id
      })

      return state.activeSubscriptions[0] ?? null
    } catch (error) {
      return null
    }
  }
)
