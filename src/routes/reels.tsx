import React from 'react'
import { MemeReels } from '@/components/Meme/meme-reels'
import { getInfiniteReelsQueryOpts } from '@/lib/queries'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return <MemeReels />
}

export const Route = createFileRoute('/reels')({
  component: RouteComponent,
  ssr: 'data-only',
  loader: async ({ context }) => {
    await context.queryClient.ensureInfiniteQueryData(
      getInfiniteReelsQueryOpts()
    )
  }
})
