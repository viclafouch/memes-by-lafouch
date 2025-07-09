import { getRandomMeme } from '@/server/meme'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/random/')({
  beforeLoad: async () => {
    const meme = await getRandomMeme()

    return redirect({
      to: '/random/$memeId',
      params: {
        memeId: meme.id
      },
      replace: true
    })
  }
})
