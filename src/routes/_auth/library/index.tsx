import React from 'react'
import { Plus } from 'lucide-react'
import { MemesOrderBy } from '@/components/Meme/Filters/memes-order-by'
import { MemesQuery } from '@/components/Meme/Filters/memes-query'
import { MemesList } from '@/components/Meme/memes-list'
import { NewMemeButton } from '@/components/Meme/new-meme-button'
import { PageHeader } from '@/components/page-header'
import { Container } from '@/components/ui/container'
import { LoadingSpinner } from '@/components/ui/spinner'
import { MEMES_FILTERS_SCHEMA } from '@/constants/meme'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const search = Route.useSearch()

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
            <MemesQuery />
            <MemesOrderBy />
          </div>
          <React.Suspense fallback={<LoadingSpinner />}>
            <MemesList
              query={search.query}
              page={search.page}
              orderBy={search.orderBy}
            />
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
  loader: () => {
    return {
      crumb: 'Memes'
    }
  }
})
