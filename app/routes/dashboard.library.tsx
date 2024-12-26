import { z } from 'zod'
import MemeCard from '~/components/MemeCard'
import Pagination from '~/components/Pagination'
import { searchMemes } from '~/utils/algolia'
import { SmileyXEyes } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
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
  const { memes, nbPages, page } = Route.useLoaderData()
  const { query } = Route.useSearch()

  return (
    <div className="min-h-full flex flex-col">
      {memes.length > 0 ? (
        <div className="flex flex-col gap-y-4">
          <div className="py-4 grid w-full gap-5 grid-cols-4">
            {memes.map((meme) => {
              return <MemeCard key={meme.id} meme={meme} />
            })}
          </div>
          <div className="w-full flex justify-center">
            <Pagination
              renderItems={(type, pageValue) => {
                if (type === 'page') {
                  return (
                    <Link
                      to="/dashboard/library"
                      search={{ query, page: pageValue }}
                      className="join-item btn [&.active]:bg-primary"
                    >
                      {pageValue}
                    </Link>
                  )
                }

                if (type === 'next') {
                  return (
                    <Link
                      to="/dashboard/library"
                      search={{ query, page: pageValue }}
                      className="join-item btn"
                    >
                      Next
                    </Link>
                  )
                }

                if (type === 'previous') {
                  return (
                    <Link
                      to="/dashboard/library"
                      search={{ query, page: pageValue }}
                      className="join-item btn"
                    >
                      Previous
                    </Link>
                  )
                }

                return (
                  <button type="button" disabled className="join-item btn">
                    ...
                  </button>
                )
              }}
              totalPages={nbPages}
              currentPage={page + 1}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center grow">
          <div className="flex flex-col items-center justify-center gap-4 text-center bg-base-200 p-12 rounded-lg">
            <SmileyXEyes size={78} />
            <span>
              No result for <code>&quot;{query}&quot;</code>. Try something
              else.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

const MEME_FILTERS_SCHEMA = z.object({
  page: fallback(z.number(), 1).default(1),
  query: fallback(z.string(), '').default('')
})

export const Route = createFileRoute('/dashboard/library')({
  component: RouteComponent,
  loaderDeps: ({ search: { page, query } }) => {
    return { page, query }
  },
  loader: ({ deps: { page, query } }) => {
    return getMemes({ data: { page, query } })
  },
  staleTime: 60_000,
  validateSearch: zodValidator(MEME_FILTERS_SCHEMA)
})
