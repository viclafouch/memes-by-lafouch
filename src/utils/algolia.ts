import { algoliasearch } from 'algoliasearch'
import { SERVER_ENVS } from '@/constants/env'
import { MemeFilters, MemeWithVideo } from '@/constants/meme'

export const client = algoliasearch(
  '5S4LKLUDFF',
  SERVER_ENVS.ALGOLIA_ADMIN_SECRET
)

const setIndexPromise = client.setSettings({
  indexName: 'memes',
  indexSettings: {
    ranking: ['desc(createdAt_timestamp)'],
    searchableAttributes: ['title', 'keywords'] as (keyof MemeWithVideo)[]
  }
})

export async function indexMemeObject(meme: MemeWithVideo) {
  await client.saveObject({
    indexName: 'memes',
    body: {
      ...meme,
      // Required for sorting
      createdAt_timestamp: meme.createdAt.getTime(),
      objectID: meme.id
    }
  })
}

export async function updateMemeObject(
  memeId: MemeWithVideo['id'],
  values: Partial<MemeWithVideo>
) {
  await client.partialUpdateObject({
    indexName: 'memes',
    objectID: memeId,
    attributesToUpdate: values
  })
}

export async function searchMemes(filters: MemeFilters) {
  const searchValue = filters.query.trim()

  await setIndexPromise
  const {
    hits,
    nbPages = 1,
    page = 1,
    nbHits
  } = await client.searchSingleIndex<MemeWithVideo>({
    indexName: 'memes',
    searchParams: {
      query: searchValue,
      typoTolerance: true,
      ignorePlurals: true,
      queryLanguages: ['fr'],
      page: filters.page - 1 < 0 ? 0 : filters.page - 1,
      removeStopWords: true,
      hitsPerPage: 20,
      attributesToHighlight: []
    }
  })

  return { memes: hits, nbPages, page, memeTotalCount: nbHits }
}

export type SearchMemesResponse = ReturnType<typeof searchMemes>
