import React from 'react'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Container from '@/components/Container'
import DeleteMemeButton from '@/components/DeleteMemeButton'
import FormManageMeme from '@/components/FormManageMeme'
import DownloadMemeButton from '@/components/MemeListItem/DownloadMemeButton'
import prisma from '@/db'
import { Download } from '@phosphor-icons/react/dist/ssr'

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
          <h1 className="text-4xl">Modifier le mème</h1>
          <span className="font-tiny text-gray-500">
            Créé le {format(new Date(meme.createdAt), 'dd/MM/yyyy')}
          </span>
          <div className="mt-2">
            <DownloadMemeButton
              size="sm"
              color="primary"
              meme={meme}
              startContent={<Download size={20} />}
            >
              Télécharger la vidéo
            </DownloadMemeButton>
            <p className="text-tiny mt-1 text-zinc-500">
              Nombre de téléchargements : {meme.downloadCount}
            </p>
          </div>
        </header>
        <div className="pt-6 w-full max-w-lg">
          <FormManageMeme meme={meme} />
        </div>
        <div className="mx-auto">
          <DeleteMemeButton size="sm" memeId={meme.id} />
        </div>
      </div>
    </Container>
  )
}

export default Page
