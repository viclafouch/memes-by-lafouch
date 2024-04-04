import { z } from 'zod'
import { extractTweetIdFromUrl } from '@/utils/tweet'
import { Prisma } from '@prisma/client'

export const memeFilters = z.object({
  orderBy: z.enum(['most_recent', 'most_old']).catch('most_recent'),
  query: z.string().catch('')
})

export type MemeWithVideo = Prisma.MemeGetPayload<{
  include: { video: true }
}>

export const TWITTER_STATUS_URL_REGEX =
  /^https?:\/\/(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)\/status\/(\d+)/

export const TWITTER_LINK_SCHEMA = z
  .string()
  .regex(TWITTER_STATUS_URL_REGEX)
  .transform((value) => {
    const url = new URL(value)
    url.search = ''
    url.hostname = 'x.com'

    const twitterId = z.string().parse(extractTweetIdFromUrl(url.toString()))

    return {
      url: url.toString(),
      twitterId
    }
  })

const SIZE_IN_MB = 16
export const MAX_SIZE_MEME_IN_BYTES = SIZE_IN_MB * 1024 * 1024

export type MemeFilters = z.infer<typeof memeFilters>

export type MemeFiltersOrderBy = MemeFilters['orderBy']
export type MemeFiltersQuery = MemeFilters['query']
