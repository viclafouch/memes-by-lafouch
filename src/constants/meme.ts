import { z } from 'zod'

export const memeFilters = z.object({
  orderBy: z.enum(['most_recent', 'most_old']).catch('most_recent'),
  query: z.string().catch('')
})

export const TWITTER_STATUS_URL_REGEX =
  /^https?:\/\/(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)\/status\/(\d+)/

export const TWITTER_LINK_SCHEMA = z
  .string()
  .regex(TWITTER_STATUS_URL_REGEX)
  .transform((value) => {
    const url = new URL(value)
    url.search = ''
    url.hostname = 'x.com'

    const twitterId = z.string().parse(url.pathname.split('/').at(-1))

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
