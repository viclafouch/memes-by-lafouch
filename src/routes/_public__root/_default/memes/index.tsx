import React from 'react'
import { Shuffle } from 'lucide-react'
import { CategoriesList } from '@/components/categories/categories-list'
import MemesPagination from '@/components/Meme/Filters/memes-pagination'
import { MemesQuery } from '@/components/Meme/Filters/memes-query'
import MemesToggleGrid from '@/components/Meme/Filters/memes-toggle-grid'
import { MemesList } from '@/components/Meme/memes-list'
import { buttonVariants } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/spinner'
import { MEMES_FILTERS_SCHEMA } from '@/constants/meme'
import {
  getCategoriesListQueryOpts,
  getMemesListQueryOpts
} from '@/lib/queries'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
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
    <div>
      <PageHeading title="Memes">Memes</PageHeading>
      <PageDescription>A collection of memes from the internet</PageDescription>
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
              <Link
                to="/random"
                className={buttonVariants({ variant: 'outline' })}
              >
                <Shuffle />
                Aléatoire
              </Link>
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
    </div>
  )
}

export const Route = createFileRoute('/_public__root/_default/memes/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getCategoriesListQueryOpts())
  },
  validateSearch: (search) => {
    return MEMES_FILTERS_SCHEMA.parse(search)
  }
})
