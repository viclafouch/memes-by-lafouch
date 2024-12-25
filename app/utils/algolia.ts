import { algoliasearch } from 'algoliasearch'
import type { MemeWithVideo } from '~/constants/meme'
import { SERVER_ENVS } from '~/constants/server-env'

const client = algoliasearch('5S4LKLUDFF', SERVER_ENVS.ALGOLIA_ADMIN_SECRET)

export async function searchMemes(filters: { query: string; page: number }) {
  const searchValue = filters.query.trim()

  await client.setSettings({
    indexName: 'memes',
    indexSettings: {
      ranking: ['desc(createdAt_timestamp)'],
      searchableAttributes: ['title', 'keywords'] as (keyof MemeWithVideo)[]
    }
  })

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

  return {
    memes: hits as MemeWithVideo[],
    nbPages,
    page,
    memeTotalCount: nbHits
  }
}
