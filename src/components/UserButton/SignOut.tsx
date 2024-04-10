import React from 'react'
import { signOut } from '@/utils/auth'
import { Button } from '@nextui-org/react'

const SignOut = () => {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <Button size="sm" color="danger" type="submit">
        Se déconnecter
      </Button>
    </form>
  )
}

export default SignOut
