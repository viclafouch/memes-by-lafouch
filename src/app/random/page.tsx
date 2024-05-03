import { redirect } from 'next/navigation'
import { getRandomMeme } from '@/utils/meme'

const Page = async () => {
  const meme = await getRandomMeme()

  redirect(`/random/${meme.id}`)
}

export default Page
