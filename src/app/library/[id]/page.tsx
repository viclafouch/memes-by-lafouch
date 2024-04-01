import React from 'react'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Container from '@/components/Container'
import FormManageMeme from '@/components/FormManageMeme'
import prisma from '@/db'

const Page = async ({ params }: { params: { id: string } }) => {
  const meme = await prisma.meme.findUnique({
    where: {
      id: params.id
    }
  })

  if (!meme) {
    notFound()
  }

  return (
    <Container>
      <div className="flex flex-col gap-6 max-w-lg mx-auto">
        <header className="text-center">
          <h1 className="text-4xl">Modifier le meme</h1>
          <span className="font-tiny text-gray-500">
            Créé le {format(new Date(meme.createdAt), 'dd/MM/yyyy')}
          </span>
        </header>
        <div className="pt-6 w-full max-w-lg">
          <FormManageMeme meme={meme} />
        </div>
      </div>
    </Container>
  )
}

export default Page
