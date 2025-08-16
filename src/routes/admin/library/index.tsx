import React from 'react'
import { Plus } from 'lucide-react'
import { MemeListItem } from '@/components/admin/meme-list-item'
import { MemesOrderBy } from '@/components/Meme/Filters/memes-order-by'
import { MemesQuery } from '@/components/Meme/Filters/memes-query'
import { NewMemeButton } from '@/components/Meme/new-meme-button'
import { PageHeader } from '@/components/page-header'
import { Paginator } from '@/components/paginator'
import { Container } from '@/components/ui/container'
import { LoadingSpinner } from '@/components/ui/spinner'
import type { MemesFilters } from '@/constants/meme'
import { MEMES_FILTERS_SCHEMA } from '@/constants/meme'
import { getMemesListQueryOpts } from '@/lib/queries'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const MemesListWrapper = () => {
  const search = Route.useSearch()

  const [debouncedValue] = useDebouncedValue(search.query, {
    wait: 300,
    leading: false
  })

  const filters = React.useMemo(() => {
    return {
      query: debouncedValue,
      page: search.page,
      orderBy: search.orderBy
    }
  }, [debouncedValue, search.page, search.orderBy])

  const memesListQuery = useSuspenseQuery(getMemesListQueryOpts(filters))

  return (
    <div className="w-full flex flex-col gap-12">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {memesListQuery.data.memes.map((meme) => {
          return <MemeListItem key={meme.id} meme={meme} />
        })}
      </div>
      <div className="flex justify-end z-0">
        <Paginator
          currentPage={(memesListQuery.data.page || 0) + 1}
          totalPages={memesListQuery.data.totalPages ?? 0}
          getLinkProps={(page) => {
            return {
              to: '/admin/library',
              search: (prevState) => {
                return {
                  page,
                  query: prevState.query,
                  orderBy: prevState.orderBy
                }
              }
            }
          }}
          showPreviousNext
        />
      </div>
    </div>
  )
}

const RouteComponent = () => {
  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  const handleOrderByChange = (value: string) => {
    navigate({
      to: '/admin/library',
      search: (prevState) => {
        return {
          page: prevState.page,
          query: prevState.query,
          orderBy: value as MemesFilters['orderBy']
        }
      },
      viewTransition: false,
      replace: true
    })
  }

  const handleQueryChange = (value: string) => {
    navigate({
      to: '/admin/library',
      search: (prevState) => {
        return {
          page: 1,
          query: value,
          orderBy: prevState.orderBy
        }
      },
      viewTransition: false,
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
            <MemesQuery
              query={search.query ?? ''}
              onQueryChange={handleQueryChange}
            />
            <div className="gap-x-3 hidden xl:flex">
              <MemesOrderBy
                orderBy={search.orderBy ?? 'most_recent'}
                onOrderByChange={handleOrderByChange}
              />
            </div>
          </div>
          <React.Suspense fallback={<LoadingSpinner />}>
            <MemesListWrapper />
          </React.Suspense>
        </div>
      </div>
    </Container>
  )
}

export const Route = createFileRoute('/admin/library/')({
  component: RouteComponent,
  validateSearch: (search) => {
    return MEMES_FILTERS_SCHEMA.parse(search)
  },
  loader: () => {
    return {
      crumb: 'Librairie'
    }
  }
})
