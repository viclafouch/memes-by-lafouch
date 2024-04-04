import React from 'react'
import { notFound } from 'next/navigation'
import { formatRelative } from 'date-fns'
import { fr } from 'date-fns/locale'
import Container from '@/components/Container'
import DeleteMemeButton from '@/components/DeleteMemeButton'
import FormUpdateMeme from '@/components/FormUpdateMeme'
import DownloadMemeButton from '@/components/MemeListItem/DownloadMemeButton'
import MemeTweetButton from '@/components/MemeTweetButton'
import prisma from '@/db'
import { DownloadSimple, Trash } from '@phosphor-icons/react/dist/ssr'

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
      <div className="w-full flex flex-col gap-6 mx-auto">
        <section className="py-10 flex h-[calc(100vh_-_60px)] w-full gap-8">
          {/* Left */}
          <div className="w-full flex-none py-4 lg:w-[44%]">
            <div className="flex flex-col justify-between px-2">
              <div className="flex justify-between items-start pb-3 border-b-3">
                <div>
                  <h1 className="text-3xl">Modifier le mème</h1>
                  <p className="text-tiny text-gray-500">
                    Dernière mise à jour :{' '}
                    {formatRelative(meme.updatedAt, new Date(), { locale: fr })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {meme.twitterUrl ? (
                    <MemeTweetButton
                      IconProps={{ size: 18 }}
                      tweetUrl={meme.twitterUrl}
                    />
                  ) : null}
                  <DownloadMemeButton
                    color="default"
                    isIconOnly
                    meme={meme}
                    size="sm"
                  >
                    <DownloadSimple size={18} />
                  </DownloadMemeButton>
                  <DeleteMemeButton isIconOnly meme={meme} size="sm">
                    <Trash size={18} />
                  </DeleteMemeButton>
                </div>
              </div>
              <div className="mt-6">
                <FormUpdateMeme meme={meme} />
              </div>
            </div>
          </div>
          <div className="relative hidden w-full overflow-hidden rounded-medium shadow-small lg:block">
            {/* Top Shadow */}
            <div className="absolute top-0 z-10 h-32 w-full rounded-medium bg-gradient-to-b from-black/80 to-transparent" />

            {/* Content */}
            <div className="absolute top-10 z-10 flex w-full items-start justify-between px-10">
              <h2 className="text-2xl font-medium text-white/70 [text-shadow:_0_2px_10px_rgb(0_0_0_/_20%)]">
                {meme.title}
              </h2>
              <div className="flex flex-col items-end gap-1">
                <p className="text-white/60">
                  {meme.downloadCount} téléchargement
                  {meme.downloadCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <video
              controls
              className="absolute inset-0 z-0 h-full w-full rounded-none object-cover"
              src={meme.videoUrl}
              width={270}
              preload="metadata"
              height="100%"
            />
          </div>
        </section>
      </div>
    </Container>
  )
}

export default Page
