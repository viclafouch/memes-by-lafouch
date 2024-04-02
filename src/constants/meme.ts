import { z } from 'zod'

export const memeFilters = z.object({
  orderBy: z.enum(['most_recent', 'most_old']).catch('most_recent'),
  query: z.string().catch('')
})

export const TWITTER_URL_REGEX =
  /^https:\/\/twitter\.com\/([A-Za-z0-9_]+)\/status\/(\d+)/

const SIZE_IN_MB = 16
export const MAX_SIZE_MEME_IN_BYTES = SIZE_IN_MB * 1024 * 1024

export type MemeFilters = z.infer<typeof memeFilters>

export type MemeFiltersOrderBy = MemeFilters['orderBy']
export type MemeFiltersQuery = MemeFilters['query']
