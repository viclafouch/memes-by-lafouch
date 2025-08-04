import { auth } from '@/lib/auth'
import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'

export const getListUsers = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { headers } = getWebRequest()

    const listUsers = await auth.api.listUsers({
      query: {
        limit: 100,
        offset: 0,
        sortBy: 'createdAt'
      },
      headers
    })

    return listUsers
  }
)
