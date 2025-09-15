import { createServerFileRoute } from '@tanstack/react-start/server'

export const ServerRoute = createServerFileRoute('/health').methods({
  GET: () => {
    return new Response('Hello, World!', {
      status: 200
    })
  }
})
