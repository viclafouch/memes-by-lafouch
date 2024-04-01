import React from 'react'
import DownloadMemeButton from '@/components/MemeListItem/DownloadMemeButton'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton
} from '@nextui-org/react'
import type { Meme } from '@prisma/client'

export type MemeListItemProps =
  | {
      meme: Meme
      isLoading?: never
    }
  | {
      meme?: never
      isLoading: true
    }

const MemeListItem = ({ meme }: MemeListItemProps) => {
  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        {meme ? (
          <div className="w-full">
            <h4 className="font-bold text-large truncate">{meme.title}</h4>
          </div>
        ) : (
          <Skeleton className="w-4/5 rounded-lg">
            <div className="w-full text-large">
              <span className="bg-default-200">{'\u00A0'}</span>
            </div>
          </Skeleton>
        )}
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div className="h-56 lg:h-44 aspect-video w-full">
          {meme ? (
            <video
              controls
              className="w-full h-full object-cover rounded-lg"
              src={meme.videoUrl}
              width={270}
              preload="metadata"
              height={200}
            />
          ) : (
            <Skeleton className="rounded-lg w-full h-full" />
          )}
        </div>
      </CardBody>
      <CardFooter>
        {meme ? (
          <DownloadMemeButton meme={meme} />
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
