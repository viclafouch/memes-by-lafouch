import React from 'react'
import { Plus } from 'lucide-react'
import { MemesOrderBy } from '@/components/Meme/Filters/memes-order-by'
import MemesPagination from '@/components/Meme/Filters/memes-pagination'
import { MemesQuery } from '@/components/Meme/Filters/memes-query'
import MemesToggleGrid from '@/components/Meme/Filters/memes-toggle-grid'
import { MemesList } from '@/components/Meme/memes-list'
import { NewMemeButton } from '@/components/Meme/new-meme-button'
import { PageHeader } from '@/components/page-header'
import { Container } from '@/components/ui/container'
import { LoadingSpinner } from '@/components/ui/spinner'
import { MEMES_FILTERS_SCHEMA } from '@/constants/meme'
import { matchIsUserAdmin } from '@/lib/auth-client'
import { getMemesListQueryOpts } from '@/lib/queries'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

type ColumnGridCount = 3 | 5 | 6

const MemesListWrapper = ({
  columnGridCount
}: {
  columnGridCount: ColumnGridCount
}) => {
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
      <MemesList
        columnGridCount={columnGridCount}
        layoutContext="library"
        memes={memesListQuery.data.memes}
      />
      <div className="flex justify-end z-0">
        <MemesPagination
          currentPage={memesListQuery.data.currentPage}
          totalPages={memesListQuery.data.totalPages}
        />
      </div>
    </div>
  )
}

const RouteComponent = () => {
  const { user } = Route.useRouteContext()
  const [columnGridCount, setColumnGridCount] = React.useState<3 | 5 | 6>(3)

  return (
    <Container>
      <PageHeader
        title="Memes"
        action={
          matchIsUserAdmin(user) ? (
            <NewMemeButton>
              <Plus /> Ajouter un mème
            </NewMemeButton>
          ) : null
        }
      />
      <div className="w-full mx-auto py-10">
        <div className="flex flex-col gap-y-4">
          <div className="border-b border-muted pb-4 flex justify-between gap-x-3">
            <MemesQuery />
            <div className="flex gap-x-3">
              <MemesToggleGrid
                columnValue={columnGridCount}
                onColumnValueChange={setColumnGridCount}
              />
              <MemesOrderBy />
            </div>
          </div>
          <React.Suspense fallback={<LoadingSpinner />}>
            <MemesListWrapper columnGridCount={columnGridCount} />
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
  pendingComponent: () => {
    return <div>Loading...</div>
  },
  loader: () => {
    return {
      crumb: 'Memes'
    }
  }
})
