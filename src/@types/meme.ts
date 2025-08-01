import type { MemeWithVideo } from '@/constants/meme'

export type MemeWithBoomarked = MemeWithVideo & { isBookmarked: boolean }
