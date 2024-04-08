import React from 'react'
import SignOut from '@/components/UserButton/SignOut'
import UserPopover from '@/components/UserButton/UserPopover'
import { auth } from '@/utils/auth'
import SignIn from './SignIn'

const UserButton = async () => {
  const session = await auth()

  if (!session?.user) {
    return <SignIn />
  }

  return (
    <UserPopover signOutButton={<SignOut />} userImage={session.user.image!} />
  )
}

export default UserButton
