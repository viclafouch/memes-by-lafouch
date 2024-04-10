import algoliasearch from 'algoliasearch'
import { SERVER_ENVS } from '@/constants/env'
import { MemeFilters, MemeWithVideo } from '@/constants/meme'

const client = algoliasearch('5S4LKLUDFF', SERVER_ENVS.ALGOLIA_ADMIN_SECRET)
export const memesIndex = client.initIndex('memes')

const setSettings = memesIndex.setSettings({
  searchableAttributes: ['title', 'keywords'] as (keyof MemeWithVideo)[]
})

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

export async function searchMemes(filters: MemeFilters) {
  await setSettings
  const searchValue = filters.query.trim()

  const { hits, nbPages } = await memesIndex.search<MemeWithVideo>(
    searchValue,
    {
      query: searchValue,
      typoTolerance: true,
      ignorePlurals: true,
      queryLanguages: ['fr'],
      page: 0,
      removeStopWords: true,
      hitsPerPage: 20,
      attributesToHighlight: []
    }
  )

  return { memes: hits, nbPages }
}

export type SearchMemesResponse = ReturnType<typeof searchMemes>
