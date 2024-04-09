import algoliasearch from 'algoliasearch'
import { SERVER_ENVS } from '@/constants/env'
import { MemeWithVideo } from '@/constants/meme'

const client = algoliasearch('5S4LKLUDFF', SERVER_ENVS.ALGOLIA_ADMIN_SECRET)
const memesIndex = client.initIndex('memes')

export async function indexMemeObject(meme: MemeWithVideo) {
  await memesIndex.saveObject({
    ...meme,
    objectID: meme.id
  })
}

export async function updateMemeObject(
  memeId: MemeWithVideo['id'],
  values: Partial<MemeWithVideo>
) {
  await memesIndex.partialUpdateObject({
    ...values,
    objectID: memeId
  })
}

export { memesIndex }
