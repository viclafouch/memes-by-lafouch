import React from 'react'
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
            className="cursor-pointer p-4"
            name={session.user.name}
            description={session.user.id}
            avatarProps={{
              src: session.user.image!
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <SignOut />
      </PopoverContent>
    </Popover>
  )
}

export default UserButton
