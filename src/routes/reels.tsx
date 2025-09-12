import React from 'react'
import { MemeReels } from '@/components/ui/kibo-ui/reel/reel-controlled'
import { getBestMemes } from '@/server/meme'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { memes } = Route.useLoaderData()

  return <MemeReels memes={memes} />
}

export const Route = createFileRoute('/reels')({
  component: RouteComponent,
  loader: async () => {
    const bestMemes = await getBestMemes()

    return {
      memes: bestMemes
    }
  }
})
