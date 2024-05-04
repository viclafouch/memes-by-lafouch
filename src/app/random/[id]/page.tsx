import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import FormRandomMeme from '@/components/FormRandomMeme'
import ShareMemeButton from '@/components/MemeListItem/ShareMemeButton'
import prisma from '@/db'
import { incrementDownloadCount } from '@/serverActions/incrementDownloadCount'
import { myVideoLoader } from '@/utils/cloudinary'
import { getMeme } from '@/utils/meme'
import { Button } from '@nextui-org/react'
import { Pen, Share } from '@phosphor-icons/react/dist/ssr'

type Props = {
  params: { id: string }
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const memes = await prisma.meme.findMany({
    select: {
      id: true
    }
  })

  return memes.map((meme) => {
    return {
      id: meme.id
    }
  })
}

const Page = async ({ params }: Props) => {
  const meme = await getMeme(params.id)

  if (!meme) {
    notFound()
  }

  return (
    <Container className="py-10 h-full flex grow">
      <div className="flex flex-col items-center gap-3 grow">
        <h1 className="text-xl text-center lg:text-3xl">{meme.title}</h1>
        <div className="grow flex w-full max-w-[720px]">
          <div className="grow flex relative w-full">
            <video
              className="absolute h-full w-full object-contains inset-0"
              src={myVideoLoader({
                src: meme.video.src
              })}
              poster={meme.video.poster || undefined}
              autoPlay
              controls
            />
          </div>
        </div>
        <div className="flex gap-4 flex-col w-full max-w-96">
          <FormRandomMeme exceptMeme={meme} />
          <div className="flex gap-4">
            <Button
              color="default"
              href={`/library/${meme.id}`}
              as={Link}
              size="sm"
              prefetch
              fullWidth
              endContent={<Pen size={20} />}
            >
              Modifier
            </Button>
            <ShareMemeButton
              incrementDownloadCount={incrementDownloadCount}
              meme={meme}
              size="sm"
              fullWidth
              endContent={<Share size={20} />}
            >
              Partager
            </ShareMemeButton>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Page
