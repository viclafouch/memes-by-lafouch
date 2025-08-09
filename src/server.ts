import type { RequestHandler } from '@tanstack/react-start/server'
import {
  createStartHandler,
  defaultStreamHandler
} from '@tanstack/react-start/server'
import { createRouter } from './router'

const handler = createStartHandler({
  createRouter
})(defaultStreamHandler)

const withHeaders: RequestHandler = async (context) => {
  const response = await handler(context)
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')

  return response
}

export default withHeaders
