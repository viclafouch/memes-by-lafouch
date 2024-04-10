import { z } from 'zod'
import { extractTweetIdFromUrl, getTweetById } from '@/utils/tweet'
import { Prisma } from '@prisma/client'

export const memeFilters = z.object({
  orderBy: z.enum(['most_recent', 'most_old']).catch('most_recent'),
  query: z.string().catch(''),
  page: z.coerce.number().catch(1)
})

export type MemeWithVideo = Prisma.MemeGetPayload<{
  include: { video: true }
}>

export const TWITTER_REGEX_THAT_INCLUDES_ID =
  /^https?:\/\/(?:twitter\.com|x\.com)\/(?:[A-Za-z0-9_]+\/status\/\d+|i\/bookmarks\?post_id=\d+)/

export const TWITTER_LINK_SCHEMA = z
  .string()
  .regex(TWITTER_REGEX_THAT_INCLUDES_ID)
  .transform(async (value) => {
    const tweetId = z.string().parse(extractTweetIdFromUrl(value))

    const tweet = await getTweetById(tweetId)

    return tweet
  })

const SIZE_IN_MB = 16
export const MAX_SIZE_MEME_IN_BYTES = SIZE_IN_MB * 1024 * 1024

export type MemeFilters = z.infer<typeof memeFilters>

export type MemeFiltersOrderBy = MemeFilters['orderBy']
export type MemeFiltersQuery = MemeFilters['query']
