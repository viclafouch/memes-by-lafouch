import React from 'react'
import { CategoriesList } from '@/components/categories/categories-list'
import { MemesOrderBy } from '@/components/Meme/Filters/memes-order-by'
import MemesPagination from '@/components/Meme/Filters/memes-pagination'
import { MemesQuery } from '@/components/Meme/Filters/memes-query'
import MemesToggleGrid from '@/components/Meme/Filters/memes-toggle-grid'
import { MemesList } from '@/components/Meme/memes-list'
import { Container } from '@/components/ui/container'
import { LoadingSpinner } from '@/components/ui/spinner'
import type { MemesFilters } from '@/constants/meme'
import { MEMES_FILTERS_SCHEMA } from '@/constants/meme'
import { getMemesListQueryOpts } from '@/lib/queries'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { PageDescription, PageHeading } from '../../-components/page-headers'

const MemesListWrapper = ({ columnGridCount }: { columnGridCount: number }) => {
  const search = Route.useSearch()

  const [debouncedValue] = useDebouncedValue(search.query, {
    wait: 300,
    leading: false
  })

  const filters = React.useMemo(() => {
    return {
      query: debouncedValue,
      page: search.page,
      orderBy: search.orderBy,
      categoryIds: search.categoryIds
    }
  }, [debouncedValue, search.page, search.orderBy, search.categoryIds])

  const memesListQuery = useSuspenseQuery(getMemesListQueryOpts(filters))

  return (
    <div className="w-full flex flex-col gap-12">
      <MemesList
        columnGridCount={columnGridCount}
        layoutContext="library"
        memes={memesListQuery.data.memes}
      />
      <div className="flex justify-end z-0">
        <MemesPagination
          currentPage={(memesListQuery.data.page || 0) + 1}
          totalPages={memesListQuery.data.totalPages ?? 0}
        />
      </div>
    </div>
  )
}

const RouteComponent = () => {
  const [columnGridCount, setColumnGridCount] = React.useState<number>(4)
  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  const handleOrderByChange = (value: string) => {
    navigate({
      to: '/memes',
      search: (prevState) => {
        return {
          page: prevState.page,
          query: prevState.query,
          orderBy: value as MemesFilters['orderBy'],
          categoryIds: prevState.categoryIds
        }
      },
      viewTransition: false,
      replace: true
    })
  }

  const handleQueryChange = (value: string) => {
    navigate({
      to: '/memes',
      search: (prevState) => {
        return {
          page: 1,
          query: value,
          orderBy: prevState.orderBy,
          categoryIds: prevState.categoryIds
        }
      },
      viewTransition: false,
      replace: true
    })
  }

  return (
    <Container>
      <PageHeading title="Memes" className="container">
        Memes
      </PageHeading>
      <PageDescription className="container">
        A collection of memes from the internet
      </PageDescription>
      <div className="w-full mx-auto py-10">
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-between gap-x-3">
            <MemesQuery
              query={search.query ?? ''}
              onQueryChange={handleQueryChange}
            />
            <div className="gap-x-3 hidden lg:flex">
              <MemesToggleGrid
                columnValue={columnGridCount}
                onColumnValueChange={setColumnGridCount}
              />
              <MemesOrderBy
                orderBy={search.orderBy ?? 'most_recent'}
                onOrderByChange={handleOrderByChange}
              />
            </div>
          </div>
          <div className="w-full py-2 border-y border-muted">
            <CategoriesList />
          </div>
          <React.Suspense fallback={<LoadingSpinner />}>
            <MemesListWrapper columnGridCount={columnGridCount} />
          </React.Suspense>
        </div>
      </div>
    </Container>
  )
}

export const Route = createFileRoute('/_public__root/_default/memes/')({
  component: RouteComponent,
  validateSearch: (search) => {
    return MEMES_FILTERS_SCHEMA.parse(search)
  }
})
