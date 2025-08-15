import { auth } from '@/lib/auth'
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getWebRequest, setResponseStatus } from '@tanstack/react-start/server'

export const getAuthUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { headers } = getWebRequest()
    const session = await auth.api.getSession({ headers })

    return session?.user || null
  }
)

export const authUserRequiredMiddleware = createMiddleware({
  type: 'function'
}).server(async ({ next }) => {
  const { headers } = getWebRequest()

  const session = await auth.api.getSession({
    headers,
    query: {
      // ensure session is fresh
      // https://www.better-auth.com/docs/concepts/session-management#session-caching
      disableCookieCache: true
    }
  })

  if (!session) {
    setResponseStatus(401)
    throw new Error('Unauthorized')
  }

  return next({ context: { user: session.user } })
})

export const adminRequiredMiddleware = createMiddleware({
  type: 'function'
})
  .middleware([authUserRequiredMiddleware])
  .server(async ({ context, next }) => {
    const { user } = context

    if (user.role !== 'admin') {
      setResponseStatus(401)
      throw new Error('Unauthorized')
    }

    return next({ context: { user } })
  })
