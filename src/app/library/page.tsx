import React from 'react'
import Container from '@/components/Container'
import MemesList from '@/components/MemesList'
import MemesListHeader from '@/components/MemesListHeader'
import { MemeFilters, memeFilters } from '@/constants/meme'
import prisma from '@/db'

async function getFilteredMemes(filters: MemeFilters) {
  const searchValue = filters.query.trim()

  return prisma.meme.findMany({
    where: searchValue
      ? {
          OR: [
            {
              title: {
                contains: searchValue
              }
            },
            {
              keywords: {
                hasSome: searchValue.split(' ').map((word) => {
                  return word.toLowerCase()
                })
              }
            }
          ]
        }
      : {},
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
      <MemesListHeader getPromiseMemes={promise} />
      <React.Suspense fallback={<MemesList isLoading />}>
        <MemesList getPromiseMemes={promise} />
      </React.Suspense>
    </Container>
  )
}

export default Page
