import type { VariantProps } from 'class-variance-authority'
import { z } from 'zod'
import type { badgeVariants } from '@/components/ui/badge'
import type { MemeStatus as PrismaMemeStatus, Prisma } from '@prisma/client'

export const MemeStatusFixed = {
  PENDING: 'PENDING',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED'
} as const satisfies {
  [key in PrismaMemeStatus]: key
}

export type MemeStatus = (typeof MemeStatusFixed)[keyof typeof MemeStatusFixed]

export const MemeStatusMeta = {
  PENDING: {
    label: 'En attente',
    className: 'text-destructive',
    badgeVariant: 'info'
  },
  PUBLISHED: {
    label: 'Publié',
    className: 'text-primary',
    badgeVariant: 'success'
  },
  REJECTED: {
    label: 'Rejeté',
    className: 'text-destructive',
    badgeVariant: 'warning'
  },
  ARCHIVED: {
    label: 'Archivé',
    className: 'text-muted-foreground',
    badgeVariant: 'destructive'
  }
} as const satisfies {
  [key in MemeStatus]: {
    label: string
    className: string
    badgeVariant: VariantProps<typeof badgeVariants>['variant']
  }
}

export const MEMES_FILTERS_SCHEMA = z.object({
  query: z.string().optional().catch(undefined),
  page: z.coerce.number().optional().catch(1),
  category: z.string().optional(),
  status: z.enum(MemeStatusFixed).optional()
})

export type MemeWithVideo = Prisma.MemeGetPayload<{
  include: { video: true }
}>

export type MemeWithCategories = Prisma.MemeGetPayload<{
  include: { categories: { include: { category: true } } }
}>

export const TWITTER_REGEX_THAT_INCLUDES_ID =
  /^https?:\/\/(?:twitter\.com|x\.com)\/(?:[A-Za-z0-9_]+\/status\/\d+|i\/bookmarks\?post_id=\d+)/

export const TWEET_LINK_SCHEMA = z
  .url({ protocol: /^https$/, hostname: /^(twitter|x)\.com$/ })
  .regex(TWITTER_REGEX_THAT_INCLUDES_ID, 'Invalid tweet URL')

const SIZE_IN_MB = 16
export const MAX_SIZE_MEME_IN_BYTES = SIZE_IN_MB * 1024 * 1024

export type MemesFilters = z.infer<typeof MEMES_FILTERS_SCHEMA>
