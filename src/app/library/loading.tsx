import React from 'react'
import Container from '@/components/Container'
import MemesList from '@/components/MemesList'
import MemesListHeader from '@/components/MemesListHeader'

const Loading = () => {
  return (
    <Container className="py-10 flex flex-col gap-6 flex-1">
      <MemesListHeader isLoading />
      <MemesList isLoading />
    </Container>
  )
}

export default Loading
