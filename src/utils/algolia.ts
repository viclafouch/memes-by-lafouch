import algoliasearch from 'algoliasearch'
import { SERVER_ENVS } from '@/constants/env'
import { MemeFilters, MemeWithVideo } from '@/constants/meme'

const client = algoliasearch('5S4LKLUDFF', SERVER_ENVS.ALGOLIA_ADMIN_SECRET)
export const memesIndex = client.initIndex('memes')

const setIndexPromise = memesIndex.setSettings({
  ranking: ['desc(createdAt_timestamp)'],
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
  const searchValue = filters.query.trim()

  await setIndexPromise
  const { hits, nbPages, page, nbHits } =
    await memesIndex.search<MemeWithVideo>(searchValue, {
      query: searchValue,
      typoTolerance: true,
      ignorePlurals: true,
      queryLanguages: ['fr'],
      page: filters.page - 1 < 0 ? 0 : filters.page - 1,
      removeStopWords: true,
      hitsPerPage: 20,
      attributesToHighlight: []
    })

  return { memes: hits, nbPages, page, memeTotalCount: nbHits }
}

export type SearchMemesResponse = ReturnType<typeof searchMemes>
