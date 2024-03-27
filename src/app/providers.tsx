'use client'

import { NextUIProvider } from '@nextui-org/react'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <NextUIProvider>{children}</NextUIProvider>
}
