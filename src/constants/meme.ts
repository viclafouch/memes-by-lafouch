import { z } from 'zod'
import type { Prisma } from '@prisma/client'

export const MEMES_ORDER_BY_OPTIONS = ['most_recent', 'most_old'] as const

export const MEMES_FILTERS_SCHEMA = z.object({
  query: z.string().optional().catch(undefined),
  orderBy: z.enum(MEMES_ORDER_BY_OPTIONS).optional().catch('most_recent'),
  page: z.coerce.number().optional().catch(1)
})

export type MemeWithVideo = Prisma.MemeGetPayload<{
  include: { video: true }
}>

export const TWITTER_REGEX_THAT_INCLUDES_ID =
  /^https?:\/\/(?:twitter\.com|x\.com)\/(?:[A-Za-z0-9_]+\/status\/\d+|i\/bookmarks\?post_id=\d+)/

export const TWEET_LINK_SCHEMA = z
  .url({ protocol: /^https$/, hostname: /^(twitter|x)\.com$/ })
  .regex(TWITTER_REGEX_THAT_INCLUDES_ID, 'Invalid tweet URL')

const SIZE_IN_MB = 16
export const MAX_SIZE_MEME_IN_BYTES = SIZE_IN_MB * 1024 * 1024

export type MemesFilters = z.infer<typeof MEMES_FILTERS_SCHEMA>
