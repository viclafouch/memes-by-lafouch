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
      <Button color="primary" type="submit" className="bg-black text-white">
        Se déconnecter
      </Button>
    </form>
  )
}

export default SignOut
