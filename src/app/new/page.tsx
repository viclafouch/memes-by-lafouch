import React from 'react'
import Container from '@/components/Container'
import FormCreateMeme from '@/components/FormCreateMeme'

const Page = () => {
  return (
    <Container className="flex flex-col gap-6 mt-10 flex-1">
      <h1 className="text-2xl text-center">
        Ajouter un mème à la bibliothèque
      </h1>
      <div className="mt-6 w-full max-w-screen-md mx-auto">
        <FormCreateMeme />
      </div>
    </Container>
  )
}

export default Page
