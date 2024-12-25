import { z } from 'zod'
import MemeCard from '~/components/MemeCard'
import { searchMemes } from '~/utils/algolia'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { fallback, zodValidator } from '@tanstack/zod-adapter'

const getMemes = createServerFn({
  method: 'GET'
})
  .validator((filters: unknown) => {
    return MEME_FILTERS_SCHEMA.parse(filters)
  })
  .handler(async ({ data }) => {
    return await searchMemes(data)
  })

const RouteComponent = () => {
  const { memes } = Route.useLoaderData()

  return (
    <div>
      <div className="py-4 grid w-full gap-5 grid-cols-4">
        {memes.map((meme) => {
          return <MemeCard key={meme.id} meme={meme} />
        })}
      </div>
    </div>
  )
}

const MEME_FILTERS_SCHEMA = z.object({
  page: fallback(z.number(), 1).default(1),
  query: fallback(z.string(), '').default('')
})

export const Route = createFileRoute('/dashboard/library')({
  component: RouteComponent,
  loaderDeps: ({ search: { page, query } }) => ({ page, query }),
  loader: ({ deps: { page, query } }) => {
    return getMemes({ data: { page, query } })
  },
  staleTime: 60_000,
  validateSearch: zodValidator(MEME_FILTERS_SCHEMA)
})
