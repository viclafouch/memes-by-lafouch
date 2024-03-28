import React from 'react'
import { Card, CardBody, CardHeader } from '@nextui-org/react'
import type { Meme } from '@prisma/client'

export type MemeListItemProps = {
  meme: Meme
}

const MemeListItem = ({ meme }: MemeListItemProps) => {
  return (
    <Card className="py-4" key={meme.id}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{meme.title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <video
          controls
          className="w-full object-cover rounded-xl"
          src={meme.videoUrl}
          width={270}
          preload="metadata"
          height={200}
        />
      </CardBody>
    </Card>
  )
}

export default MemeListItem
