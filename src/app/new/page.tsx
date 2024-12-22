import React from 'react'
import type { Metadata } from 'next'
import FormsTabs from '@/app/new/FormsTabs'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'Viclafouch - Ajouter un mème'
}

const Page = () => {
  return (
    <Container className="py-10 flex flex-col gap-6 mt-10 flex-1">
      <h1 className="text-3xl font-bold leading-9 text-default-foreground text-center">
        Ajouter un mème
      </h1>
      <div className="mt-6 w-full max-w-screen-md mx-auto">
        <FormsTabs />
      </div>
    </Container>
  )
}

export default Page
