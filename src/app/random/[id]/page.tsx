import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import { myVideoLoader } from '@/utils/cloudinary'
import { getMeme, getRandomMeme } from '@/utils/meme'
import { Button } from '@nextui-org/react'
import { Pen, ShuffleSimple } from '@phosphor-icons/react/dist/ssr'

type Props = {
  params: { id: string }
}

const Page = async ({ params }: Props) => {
  const meme = await getMeme(params.id)

  if (!meme) {
    notFound()
  }

  const randomMeme = await getRandomMeme()

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
        <div className="flex gap-6">
          <Button
            color="secondary"
            href={`/library/${meme.id}`}
            as={Link}
            endContent={<Pen size={20} />}
          >
            Modifier
          </Button>
          <Button
            color="primary"
            href={`/random/${randomMeme.id}`}
            as={Link}
            endContent={<ShuffleSimple size={20} />}
          >
            Aléatoire
          </Button>
        </div>
      </div>
    </Container>
  )
}

export default Page
