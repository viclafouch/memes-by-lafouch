'use client'

import React from 'react'
import Link from 'next/link'
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User
} from '@nextui-org/react'
import { FileVideo, XLogo } from '@phosphor-icons/react'

export type UserPopoverProps = {
  userImage: string
  signOutButton: React.ReactNode
}

const UserPopover = ({ userImage, signOutButton }: UserPopoverProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => {
        return setIsOpen(open)
      }}
      placement="bottom"
      showArrow
      offset={10}
    >
      <PopoverTrigger>
        <Button variant="solid" disableRipple className="bg-transparent">
          <User
            className="cursor-pointer p-0"
            classNames={{
              wrapper: 'hidden md:block'
            }}
            name=""
            description=""
            avatarProps={{
              src: userImage
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 gap-2">
        <Button
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          onClick={() => {
            return setIsOpen(false)
          }}
          className="sm:hidden"
          fullWidth
          size="sm"
          color="primary"
          href="/library"
          as={Link}
        >
          Bibliothèque
        </Button>
        <Divider className="sm:hidden" />
        <div className="sm:hidden flex flex-col w-full">
          <h4 className="text-center text-tiny pb-2">Ajouter un mème</h4>
          <div className="flex flex-col gap-1 w-full">
            <Button
              as={Link}
              href="/"
              // eslint-disable-next-line @typescript-eslint/no-deprecated
              onClick={() => {
                return setIsOpen(false)
              }}
              size="sm"
              fullWidth
              endContent={<XLogo size={20} />}
            >
              Via Twitter
            </Button>
            <Button
              as={Link}
              href="/new"
              // eslint-disable-next-line @typescript-eslint/no-deprecated
              onClick={() => {
                return setIsOpen(false)
              }}
              size="sm"
              fullWidth
              color="default"
              endContent={<FileVideo size={20} />}
            >
              Via un fichier
            </Button>
          </div>
        </div>
        <Divider className="sm:hidden" />
        {signOutButton}
      </PopoverContent>
    </Popover>
  )
}

export default UserPopover
