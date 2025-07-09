import React from 'react'
import { Download, Pen, Share, Twitter } from 'lucide-react'
import { DownloadMemeButton } from '@/components/Meme/download-meme-button'
import { EditMemeButton } from '@/components/Meme/edit-meme-button'
import { MemeVideo } from '@/components/Meme/meme-video'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import type { MemeWithVideo } from '@/constants/meme'
import { Link } from '@tanstack/react-router'

type MemeListItemProps = {
  meme: MemeWithVideo
}

export const MemeListItem = ({ meme }: MemeListItemProps) => {
  const limitKeywordsToDisplay = 8
  const keywordsSplitted = meme
    ? meme.keywords.slice(0, limitKeywordsToDisplay)
    : []
  const restKeywordsCount =
    meme && meme.keywords.length > limitKeywordsToDisplay
      ? meme.keywords.length - limitKeywordsToDisplay
      : 0

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow py-2 gap-0">
      <CardHeader className="pb-0 px-4">
        <div className="overflow-hidden">
          <Link to="/library/$memeId" params={{ memeId: meme.id }}>
            <CardTitle className="text-md line-clamp-2 truncate">
              {meme.title}
            </CardTitle>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="relative aspect-video h-56 lg:h-44 w-full py-2 px-4">
        <MemeVideo
          poster={meme.video.poster ?? undefined}
          meme={meme}
          controls
          className="border border-white/10 w-full h-full object-contain rounded-lg bg-muted"
          width={270}
          preload={meme.video.poster ? 'none' : 'metadata'}
          height={200}
        />
      </CardContent>
      <Divider />
      <div className="flex-grow py-2">
        <div className="flex px-3 flex-wrap gap-2">
          {keywordsSplitted.map((keyword) => {
            return (
              <Badge variant="secondary" key={keyword}>
                {keyword}
              </Badge>
            )
          })}
          {restKeywordsCount > 0 ? (
            <Badge variant="secondary">+{restKeywordsCount}</Badge>
          ) : null}
        </div>
      </div>
      <Divider />
      <CardFooter className="pt-2 px-4">
        <div className="w-full flex justify-end gap-x-2">
          <EditMemeButton meme={meme} variant="outline" size="icon">
            <Pen />
          </EditMemeButton>
          {meme.tweetUrl ? (
            <Button asChild variant="outline" size="icon">
              <Link to={meme.tweetUrl} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
                <Twitter />
              </Link>
            </Button>
          ) : null}
          <DownloadMemeButton variant="outline" size="icon" meme={meme}>
            <Download />
          </DownloadMemeButton>
          <ShareMemeButton meme={meme} size="icon" variant="outline">
            <Share />
          </ShareMemeButton>
        </div>
      </CardFooter>
    </Card>
  )
}
