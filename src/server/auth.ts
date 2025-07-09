import { auth } from '@/lib/auth'
import { createMiddleware, createServerFn, json } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'

export const getAuthUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { headers } = getWebRequest()
    const session = await auth.api.getSession({ headers })

    return session?.user || null
  }
)

export const authUserMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const user = await getAuthUser()

    return next({ context: { user } })
  }
)

export const authUserRequiredMiddleware = createMiddleware({ type: 'function' })
  .middleware([authUserMiddleware])
  .server(async ({ next, context }) => {
    if (!context.user) {
      throw json(
        { message: 'You must be logged in to do that!' },
        { status: 401 }
      )
    }

    return next({ context: { user: context.user } })
  })
