import { z } from 'zod'

export const memeFilters = z.object({
  orderBy: z.enum(['most_recent', 'most_old']).catch('most_recent'),
  query: z.string().catch('')
})

export type MemeFilters = z.infer<typeof memeFilters>

export type MemeFiltersOrderBy = MemeFilters['orderBy']
export type MemeFiltersQuery = MemeFilters['query']
