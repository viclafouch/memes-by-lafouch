'use client'

import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextUIProvider>
  )
}
