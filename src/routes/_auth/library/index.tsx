import React from 'react'
import { Plus } from 'lucide-react'
import { MemesOrderBy } from '@/components/Meme/Filters/memes-order-by'
import { MemesQuery } from '@/components/Meme/Filters/memes-query'
import { MemesList } from '@/components/Meme/memes-list'
import { NewMemeButton } from '@/components/Meme/new-meme-button'
import { PageHeader } from '@/components/page-header'
import { Container } from '@/components/ui/container'
import { LoadingSpinner } from '@/components/ui/spinner'
import type { MemesFilters } from '@/constants/meme'
import { MEMES_FILTERS_SCHEMA } from '@/constants/meme'
import { getMemesListQueryOpts } from '@/lib/queries'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const handleQueryChange = (query: MemesFilters['query']) => {
    navigate({
      search: {
        page: 1,
        query,
        orderBy: search.orderBy
      },
      replace: true
    })
  }

  const handlePageChange = (page: MemesFilters['page']) => {
    navigate({
      search: {
        page,
        query: search.query,
        orderBy: search.orderBy
      },
      replace: true
    })
  }

  const handleOrderByChange = (orderBy: MemesFilters['orderBy']) => {
    navigate({
      search: {
        page: search.page,
        query: search.query,
        orderBy
      },
      replace: true
    })
  }

  return (
    <Container>
      <PageHeader
        title="Memes"
        action={
          <NewMemeButton>
            <Plus /> Ajouter un mème
          </NewMemeButton>
        }
      />
      <div className="w-full mx-auto py-10">
        <div className="flex flex-col gap-y-4">
          <div className="border-b border-muted pb-4 flex justify-between gap-x-3">
            <MemesQuery query={search.query} onChange={handleQueryChange} />
            <MemesOrderBy
              orderBy={search.orderBy}
              onChange={handleOrderByChange}
            />
          </div>
          <React.Suspense fallback={<LoadingSpinner />}>
            <MemesList onPageChange={handlePageChange} filters={search} />
          </React.Suspense>
        </div>
      </div>
    </Container>
  )
}

export const Route = createFileRoute('/_auth/library/')({
  component: RouteComponent,
  validateSearch: (search) => {
    return MEMES_FILTERS_SCHEMA.parse(search)
  },
  loaderDeps: ({ search }) => {
    return {
      query: search.query,
      page: search.page,
      orderBy: search.orderBy
    }
  },
  loader: ({ deps, context }) => {
    context.queryClient.ensureQueryData(getMemesListQueryOpts(deps))

    return {
      crumb: 'Memes'
    }
  }
})
