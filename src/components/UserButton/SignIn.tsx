import React from 'react'
import { signIn } from '@/utils/auth'
import { Button } from '@nextui-org/react'
import { UserCircle } from '@phosphor-icons/react/dist/ssr'

const SignIn = () => {
  return (
    <form
      action={async () => {
        'use server'
        await signIn()
      }}
    >
      <Button
        color="primary"
        type="submit"
        className="bg-black text-white"
        endContent={<UserCircle size={26} />}
      >
        Se connecter
      </Button>
    </form>
  )
}

export default SignIn
