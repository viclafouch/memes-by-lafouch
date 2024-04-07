import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import DownloadMemeButton from '@/components/MemeListItem/DownloadMemeButton'
import MemeTweetButton from '@/components/MemeTweetButton'
import { MemeWithVideo } from '@/constants/meme'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Skeleton,
  Spacer
} from '@nextui-org/react'
import { DownloadSimple, Pen, Share } from '@phosphor-icons/react/dist/ssr'

const ShareMemeButton = dynamic(
  () => {
    return import('@/components/MemeListItem/ShareMemeButton')
  },
  { ssr: false }
)

export type MemeListItemProps =
  | {
      meme: MemeWithVideo
      isLoading?: never
    }
  | {
      meme?: never
      isLoading: true
    }

const MemeListItem = ({ meme }: MemeListItemProps) => {
  const limitKeywordsToDisplay = 3
  const keywordsSplitted = meme
    ? meme.keywords.slice(0, limitKeywordsToDisplay)
    : []
  const restKeywordsCount =
    meme && meme.keywords.length > limitKeywordsToDisplay
      ? meme.keywords.length - limitKeywordsToDisplay
      : 0

  return (
    <Card>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        {meme ? (
          <div className="w-3/4">
            <Link href={`/library/${meme.id}`}>
              <h4 className="font-semibold text-medium truncate">
                {meme.title}
              </h4>
            </Link>
          </div>
        ) : (
          <Skeleton className="w-4/5 rounded-lg">
            <div className="w-full text-medium">
              <span className="bg-default-200">{'\u00A0'}</span>
            </div>
          </Skeleton>
        )}
      </CardHeader>
      <CardBody className="grow-0 overflow-visible py-2">
        <div className="h-56 lg:h-44 aspect-video w-full">
          {meme ? (
            <video
              controls
              className="w-full h-full object-cover rounded-lg"
              src={meme.video.src}
              poster={meme.video.poster || undefined}
              width={270}
              preload={meme.video.poster ? 'none' : 'metadata'}
              height={200}
            />
          ) : (
            <Skeleton className="rounded-lg w-full h-full" />
          )}
        </div>
      </CardBody>
      {meme ? (
        <>
          <Spacer y={2} />
          <Divider />
          <Spacer y={2} />
          {keywordsSplitted.length > 0 ? (
            <div className="flex-grow">
              <div className="flex px-3 flex-wrap gap-2">
                {keywordsSplitted.map((keyword, index) => {
                  return (
                    <Chip
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${keyword}-${index}`}
                      variant="bordered"
                    >
                      {keyword}
                    </Chip>
                  )
                })}
                {restKeywordsCount > 0 ? (
                  <Chip variant="faded">+{restKeywordsCount}</Chip>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex grow px-3 flex-wrap gap-2">
              <p className="text-small text-gray-400">Aucun mot clé.</p>
            </div>
          )}
        </>
      ) : null}
      <Spacer y={2} />
      <Divider />
      <CardFooter>
        {meme ? (
          <div className="w-full flex justify-end gap-2">
            <ShareMemeButton size="sm" isIconOnly meme={meme}>
              <Share size={20} />
            </ShareMemeButton>
            <Button
              as={Link}
              href={`/library/${meme.id}`}
              size="sm"
              isIconOnly
              color="primary"
              aria-label="Editer"
            >
              <Pen size={20} />
            </Button>
            <DownloadMemeButton
              color="default"
              size="sm"
              isIconOnly
              meme={meme}
            >
              <DownloadSimple size={20} />
            </DownloadMemeButton>
            {meme.tweetUrl ? (
              <MemeTweetButton tweetUrl={meme.tweetUrl} />
            ) : null}
          </div>
        ) : (
          <Skeleton className="rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
        )}
      </CardFooter>
    </Card>
  )
}

export default MemeListItem
