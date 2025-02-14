import React from 'react'
import { Metadata } from 'next'
import Container from '@/components/Container'
import MemesList from '@/components/MemesList'
import MemesListHeader from '@/components/MemesListHeader'
import { memeFilters } from '@/constants/meme'
import { searchMemes } from '@/utils/algolia'

export const metadata: Metadata = {
  title: 'Viclafouch - Mes mèmes'
}

const Page = async ({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const filters = await memeFilters.parseAsync(await searchParams)
  const promise = searchMemes(filters)

  return (
    <Container className="py-10 flex flex-col gap-6 flex-1">
      <React.Suspense fallback={<MemesListHeader isLoading />}>
        <MemesListHeader getPromiseMemes={promise} />
      </React.Suspense>
      <React.Suspense
        key={JSON.stringify(filters)}
        fallback={<MemesList isLoading />}
      >
        <MemesList getPromiseMemes={promise} />
      </React.Suspense>
    </Container>
  )
}

export default Page
