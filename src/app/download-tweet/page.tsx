import React from 'react'
import type { Metadata } from 'next'
import Container from '@/components/Container'
import FormDownloadTweet from '@/components/FormDownloadTweet'

export const metadata: Metadata = {
  title: 'Viclafouch - Téléchargeur de Vidéos Twitter'
}

const Page = () => {
  return (
    <Container className="py-10 flex flex-col gap-6 mt-10 flex-1">
      <h1 className="text-2xl text-center">Téléchargeur de Vidéos Twitter</h1>
      <div className="mt-6 w-full max-w-screen-md mx-auto">
        <FormDownloadTweet />
      </div>
    </Container>
  )
}

export default Page
