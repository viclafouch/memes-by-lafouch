import { z } from 'zod/v4'
import { TWEET_LINK_SCHEMA } from '@/constants/meme'
import { authUserRequiredMiddleware } from '@/server/auth'
import { extractTweetIdFromUrl, getTweetById } from '@/utils/tweet'
import { createServerFn } from '@tanstack/react-start'

export const getTweetFromUrl = createServerFn({ method: 'GET' })
  .validator((url: string) => {
    return TWEET_LINK_SCHEMA.parse(url)
  })
  .middleware([authUserRequiredMiddleware])
  .handler(async ({ data: url }) => {
    const tweetId = z.string().parse(extractTweetIdFromUrl(url))

    const tweet = await getTweetById(tweetId)

    return tweet
  })
