import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { formatRelative } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'
import DeleteMemeButton from '@/components/DeleteMemeButton'
import FormUpdateMeme from '@/components/FormUpdateMeme'
import DownloadMemeButton from '@/components/MemeListItem/DownloadMemeButton'
import ShareMemeButton from '@/components/MemeListItem/ShareMemeButton'
import MemeTweetButton from '@/components/MemeTweetButton'
import { incrementDownloadCount } from '@/serverActions/incrementDownloadCount'
import { myVideoLoader } from '@/utils/cloudinary'
import { getMeme } from '@/utils/meme'
import { DownloadSimple, Share, Trash } from '@phosphor-icons/react/dist/ssr'

type Props = {
  params: { id: string }
}

export const revalidate = 1800 // revalidate the data at most every half hour

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meme = await getMeme(params.id)

  return {
    title: meme!.title
  }
}

const Page = async ({ params }: { params: { id: string } }) => {
  const meme = await getMeme(params.id)

  if (!meme) {
    notFound()
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-8">
      {/* Left */}
      <div className="w-full lg:flex-none py-4 lg:w-[44%]">
        <div className="flex flex-col justify-between px-2">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start pb-3 border-b-3">
            <div>
              <h1 className="text-3xl">Modifier le mème</h1>
              <p className="text-tiny text-gray-500">
                Dernière mise à jour :{' '}
                {formatRelative(
                  toZonedTime(meme.updatedAt, 'Europe/Paris'),
                  new Date(),
                  { locale: fr }
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {meme.tweetUrl ? (
                <MemeTweetButton
                  IconProps={{ size: 18 }}
                  tweetUrl={meme.tweetUrl}
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
      <div className="order-first	lg:order-none relative lg:h-auto w-full overflow-hidden lg:rounded-medium shadow-small flex flex-col gap-6">
        {/* Top Shadow */}
        <div className="hidden lg:block lg:absolute top-0 z-10 lg:h-32 w-full rounded-medium bg-gradient-to-b from-black/80 to-transparent" />

        {/* Content */}
        <div className="lg:absolute top-5 lg:top-10 z-10 flex w-full items-start justify-between lg:px-10 gap-4">
          <div className="flex flex-col w-full overflow-hidden">
            <h2 className="truncate text-2xl font-medium text-white lg:text-white/70 [text-shadow:_0_2px_10px_rgb(0_0_0_/_20%)]">
              {meme.title}
            </h2>
            <p className="text-white/60">
              {meme.downloadCount} téléchargement
              {meme.downloadCount > 1 ? 's' : ''}
            </p>
          </div>
          <div className="lg:hidden">
            <ShareMemeButton
              variant="shadow"
              meme={meme}
              incrementDownloadCount={incrementDownloadCount}
              color="secondary"
              endContent={<Share size={20} />}
            >
              Partager
            </ShareMemeButton>
          </div>
        </div>
        <video
          controls
          className="lg:absolute inset-0 z-0 h-full w-full rounded-medium lg:rounded-none object-contain"
          src={myVideoLoader({ src: meme.video.src })}
          poster={meme.video.poster || undefined}
          width={270}
          preload={meme.video.poster ? 'none' : 'metadata'}
          height="100%"
        />
      </div>
    </div>
  )
}

export default Page
