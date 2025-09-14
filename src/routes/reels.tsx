import React from 'react'
import { DefaultLoading } from '@/components/default-loading'
import { MemeReels } from '@/components/Meme/meme-reels'
import { getInfiniteReelsQueryOpts } from '@/lib/queries'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <div className="bg-primary-foreground dark">
      <MemeReels />
    </div>
  )
}

export const Route = createFileRoute('/reels')({
  component: RouteComponent,
  ssr: 'data-only',
  pendingComponent: () => {
    return <DefaultLoading className="bg-primary-foreground dark h-screen" />
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureInfiniteQueryData(
      getInfiniteReelsQueryOpts()
    )
  }
})
