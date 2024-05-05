'use server'

import { redirect } from 'next/navigation'
import { getRandomMeme } from '@/utils/meme'
import { Meme } from '@prisma/client'

export async function redirectRandomMeme(memeId: Meme['id']) {
  const randomMeme = await getRandomMeme({ exceptId: memeId })

  redirect(`/random/${randomMeme.id}`)
}
