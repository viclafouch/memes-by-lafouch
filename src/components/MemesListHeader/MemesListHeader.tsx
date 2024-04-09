import React from 'react'
import Link from 'next/link'
import MemesOrderBy from '@/components/Filters/MemesOrderBy'
import MemesQuery from '@/components/Filters/MemesQuery'
import { MemeWithVideo } from '@/constants/meme'
import prisma from '@/db'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton
} from '@nextui-org/react'
import { FileVideo, XLogo } from '@phosphor-icons/react/dist/ssr'

export type MemesListHeaderProps =
  | {
      getPromiseMemes: Promise<MemeWithVideo[]>
      isLoading?: never
    }
  | {
      isLoading: true
      getPromiseMemes?: never
    }

const MemesListHeader = ({
  getPromiseMemes,
  isLoading
}: MemesListHeaderProps) => {
  const memes = getPromiseMemes ? React.use(getPromiseMemes) : []
  const totalCount = getPromiseMemes ? React.use(prisma.meme.count()) : 0

  return (
    <header className="flex flex-col gap-4">
      <div className="flex justify-between flex-col md:flex-row items-center gap-4">
        {isLoading ? (
          <Skeleton className="w-2/6 rounded-lg">
            <div className="w-full text-large">
              <span className="bg-default-200">{'\u00A0'}</span>
            </div>
          </Skeleton>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-large font-semibold">{memes.length} mèmes</h1>
            {' / '}
            <span className="mt-1 text-tiny font-semibold">
              {' '}
              {totalCount} au total
            </span>
          </div>
        )}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {isLoading ? (
            <Skeleton className="md:w-40 grow md:grow-0 h-unit-10 rounded-full" />
          ) : (
            <Popover backdrop="opaque" placement="bottom" showArrow offset={10}>
              <PopoverTrigger>
                <Button
                  variant="bordered"
                  className="grow md:grow-0 rounded-full"
                  color="primary"
                >
                  Ajouter un mème
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2">
                <div className="flex flex-col gap-2">
                  <Button
                    as={Link}
                    href="/"
                    fullWidth
                    size="sm"
                    className="bg-black text-white"
                    endContent={<XLogo size={20} />}
                  >
                    Via Twitter
                  </Button>
                  <Button
                    as={Link}
                    href="/new"
                    fullWidth
                    size="sm"
                    color="default"
                    endContent={<FileVideo size={20} />}
                  >
                    Via un fichier
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <div className="grow md:grow-0 shrink-0 md:w-40">
            {isLoading ? (
              <Skeleton className="grow md:grow-0 h-unit-10 rounded-full" />
            ) : (
              <MemesOrderBy />
            )}
          </div>
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="w-full h-unit-12 rounded-full" />
      ) : (
        <MemesQuery />
      )}
    </header>
  )
}

export default MemesListHeader
