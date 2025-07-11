import React from 'react'
import { Download, Pen, Share, Twitter } from 'lucide-react'
import { DownloadMemeButton } from '@/components/Meme/download-meme-button'
import { EditMemeButton } from '@/components/Meme/edit-meme-button'
import { MemeVideo, playVideo, stopVideo } from '@/components/Meme/meme-video'
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

export const MemeListItem = React.memo(({ meme }: MemeListItemProps) => {
  const contentRef = React.useRef<HTMLDivElement>(null!)
  const videoRef = React.useRef<HTMLVideoElement>(null!)

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
      <CardContent
        className="group relative aspect-video h-56 lg:h-44 w-full py-2 px-4 border-y border-white/10 overflow-hidden"
        ref={contentRef}
      >
        {meme.video.poster ? (
          <img
            src={meme.video.poster || ''}
            className="w-full h-full object-cover bg-muted absolute inset-0 z-10  blur-md lg:blur-none group-hover:blur-md transition-all duration-300 scale-125 lg:scale-100 lg:group-hover:scale-125 origin-center delay-100"
            width="100%"
            loading="lazy"
            height="100%"
            alt={meme.title}
          />
        ) : null}
        <MemeVideo
          className="
            absolute inset-0 w-full h-full object-contain lg:opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100 z-10 delay-100"
          meme={meme}
          onMouseLeave={(event) => {
            stopVideo(event.currentTarget)
          }}
          onMouseEnter={(event) => {
            playVideo(event.currentTarget)
          }}
          ref={videoRef}
          controls
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
})
