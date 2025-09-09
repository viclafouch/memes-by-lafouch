import type { RequestHandler } from '@tanstack/react-start/server'
import {
  createStartHandler,
  defaultStreamHandler
} from '@tanstack/react-start/server'
import { createAppRouter } from './router'

const handler = createStartHandler({
  createRouter: createAppRouter
})(defaultStreamHandler)

const withHeaders: RequestHandler = async (context) => {
  const response = await handler(context)
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')

  return response
}

export default withHeaders
