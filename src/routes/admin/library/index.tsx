import React from 'react'
import { Plus } from 'lucide-react'
import { MemeListItem } from '@/components/admin/meme-list-item'
import { NewMemeButton } from '@/components/admin/new-meme-button'
import { MemesFilterStatus } from '@/components/Meme/Filters/memes-filter-status'
import { MemesQuery } from '@/components/Meme/Filters/memes-query'
import { PageHeader } from '@/components/page-header'
import { Paginator } from '@/components/paginator'
import { Container } from '@/components/ui/container'
import { LoadingSpinner } from '@/components/ui/spinner'
import type { MemeStatus } from '@/constants/meme'
import { MEMES_FILTERS_SCHEMA } from '@/constants/meme'
import { getAdminMemesListQueryOpts } from '@/lib/queries'
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
      status: search.status
    }
  }, [debouncedValue, search.page, search.status])

  const memesListQuery = useSuspenseQuery(getAdminMemesListQueryOpts(filters))

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
                  status: prevState.status
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

  const handleStatusChange = (status: MemeStatus | null) => {
    navigate({
      to: '/admin/library',
      search: (prevState) => {
        return {
          page: 1,
          query: prevState.query,
          status: status ?? undefined
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
          status: prevState.status
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
              <MemesFilterStatus
                status={search.status ?? null}
                onStatusChange={handleStatusChange}
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
