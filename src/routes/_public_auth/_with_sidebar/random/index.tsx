import { getRandomMeme } from '@/server/meme'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public_auth/_with_sidebar/random/')({
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
