import { ENV } from '@/constants/env'
import type { MemeWithVideo } from '@/constants/meme'
import { searchClient } from '@algolia/client-search'

const appID = 'W4S6H0K8DZ'
export const algoliaIndexName = 'backup'

export const algoliaClient = searchClient(appID, ENV.ALGOLIA_SECRET)

export function memeToAlgoliaRecord(meme: MemeWithVideo) {
  return {
    ...meme,
    objectID: meme.id,
    createdAtTime: meme.createdAt.getTime()
  }
}
