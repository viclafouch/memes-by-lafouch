import React from 'react'
import Link from 'next/link'
import { auth } from '@/utils/auth'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User
} from '@nextui-org/react'
import SignIn from './SignIn'
import SignOut from './SignOut'

const UserButton = async () => {
  const session = await auth()

  if (!session?.user) {
    return <SignIn />
  }

  return (
    <Popover placement="bottom" showArrow offset={10}>
      <PopoverTrigger>
        <Button variant="solid" disableRipple className="bg-transparent">
          <User
            className="cursor-pointer p-0"
            classNames={{
              wrapper: 'hidden md:block'
            }}
            name=""
            description={session.user.id}
            avatarProps={{
              src: session.user.image!
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 gap-2">
        <Button fullWidth href="/library" as={Link}>
          Bibliothèque
        </Button>
        <SignOut />
      </PopoverContent>
    </Popover>
  )
}

export default UserButton
