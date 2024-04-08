'use client'

import React from 'react'
import Link from 'next/link'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User
} from '@nextui-org/react'

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
          onClick={() => {
            return setIsOpen(false)
          }}
          className="sm:hidden"
          fullWidth
          href="/library"
          as={Link}
        >
          Bibliothèque
        </Button>
        {signOutButton}
      </PopoverContent>
    </Popover>
  )
}

export default UserPopover
