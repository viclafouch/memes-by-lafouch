'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'
import { redirectRandomMeme } from '@/serverActions/redirectRandomMeme'
import { Button } from '@heroui/react'
import { ShuffleSimple } from '@phosphor-icons/react'
import { Meme } from '@prisma/client'

const SubmitButton = () => {
  const { pending } = useFormStatus()

  return (
    <Button
      color="primary"
      type="submit"
      fullWidth
      size="lg"
      isLoading={pending}
      endContent={<ShuffleSimple size={20} />}
    >
      Aléatoire
    </Button>
  )
}

const FormRandomMeme = ({ exceptMeme }: { exceptMeme: Meme }) => {
  const redirectRandomMemeWithId = redirectRandomMeme.bind(null, exceptMeme.id)

  return (
    <form className="w-full" action={redirectRandomMemeWithId}>
      <SubmitButton />
    </form>
  )
}

export default FormRandomMeme
