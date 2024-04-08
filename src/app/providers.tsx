'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { SnackbarProvider } from 'notistack'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
        >
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </SnackbarProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
