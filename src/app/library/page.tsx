import React from 'react'
import { Metadata } from 'next'
import Container from '@/components/Container'
import MemesList from '@/components/MemesList'
import MemesListHeader from '@/components/MemesListHeader'
import { MemeFilters, memeFilters } from '@/constants/meme'
import prisma from '@/db'
import { memesIndex } from '@/utils/algolia'
import { Meme } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Viclafouch - Mes mèmes'
}

async function getFilteredMemes(filters: MemeFilters) {
  const searchValue = filters.query.trim()

  const { hits } = await memesIndex.search(searchValue, {
    query: searchValue,
    attributesToRetrieve: ['title', 'keywords'] as (keyof Meme)[],
    typoTolerance: true,
    ignorePlurals: true,
    queryLanguages: ['fr'],
    removeStopWords: true,
    hitsPerPage: 1000
  })

  return prisma.meme.findMany({
    where: {
      id: {
        in: hits.map((hit) => {
          return hit.objectID
        })
      }
    },
    orderBy: {
      createdAt: filters.orderBy === 'most_old' ? 'asc' : 'desc'
    },
    include: {
      video: true
    }
  })
}

const Page = ({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const filters = memeFilters.parse(searchParams)
  const promise = getFilteredMemes(filters)

  return (
    <Container className="py-10 flex flex-col gap-6 flex-1">
      <React.Suspense
        fallback={
          <>
            <MemesListHeader isLoading />
            <MemesList isLoading />
          </>
        }
      >
        <MemesListHeader getPromiseMemes={promise} />
        <MemesList getPromiseMemes={promise} />
      </React.Suspense>
    </Container>
  )
}

export default Page
