import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RandomVideo from '@/app/random/[id]/RandomVideo'
import Container from '@/components/Container'
import FormRandomMeme from '@/components/FormRandomMeme'
import ShareMemeButton from '@/components/MemeListItem/ShareMemeButton'
import { incrementDownloadCount } from '@/serverActions/incrementDownloadCount'
import { redirectRandomMeme } from '@/serverActions/redirectRandomMeme'
import { myVideoLoader } from '@/utils/cloudinary'
import { getMeme } from '@/utils/meme'
import { Button } from '@heroui/react'
import { Pen, Share } from '@phosphor-icons/react/dist/ssr'

type Props = {
  params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
  const { id } = await params
  const meme = await getMeme(id)

  if (!meme) {
    notFound()
  }

  return (
    <Container className="pb-5 pt-10 h-full flex grow">
      <div className="flex flex-col items-center gap-6 grow">
        <h1 className="text-xl text-center lg:text-3xl">{meme.title}</h1>
        <div className="grow flex w-full max-w-[720px]">
          <div className="grow flex relative w-full">
            <RandomVideo
              src={myVideoLoader({ src: meme.video.src })}
              onEnded={async () => {
                'use server'

                return redirectRandomMeme(meme.id)
              }}
              poster={meme.video.poster || undefined}
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
