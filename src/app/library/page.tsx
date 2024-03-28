import React from 'react'
import Container from '@/components/Container'
import MemesList from '@/components/MemesList'
import MemesListHeader from '@/components/MemesListHeader'
import { memeFilters } from '@/constants/meme'

const Page = ({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const filters = memeFilters.parse(searchParams)

  return (
    <Container className="flex flex-col gap-6">
      <MemesListHeader filters={filters} />
      <React.Suspense fallback={<div>Loading...</div>}>
        <MemesList filters={filters} />
      </React.Suspense>
    </Container>
  )
}

export default Page
