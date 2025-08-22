import { getRandomMeme } from '@/server/meme'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public__root/_default/random/')({
  pendingMs: 1000,
  loader: async () => {
    const meme = await getRandomMeme()

    return redirect({
      to: '/memes/$memeId',
      params: {
        memeId: meme.id
      },
      replace: true
    })
  }
})
