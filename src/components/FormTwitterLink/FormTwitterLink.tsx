'use client'

import React from 'react'
import {
  ExtractTwitterFormState,
  extractTwitterLink
} from '@/serverActions/extractTwitterLink'
import { Button, Input } from '@heroui/react'
import { CloudArrowDown, Link as LinkIcon } from '@phosphor-icons/react'

const initialState: ExtractTwitterFormState = {
  status: 'idle'
}

const FormTwitterLink = () => {
  const [formState, formAction, isPending] = React.useActionState(
    extractTwitterLink,
    initialState
  )

  return (
    <form action={formAction} className="w-full flex flex-col gap-4">
      <Input
        fullWidth
        type="text"
        isRequired
        defaultValue=""
        size="lg"
        name="link"
        label="Tweet URL"
        startContent={<LinkIcon size={20} />}
      />
      <div className="w-full flex flex-col">
        <Button
          isLoading={isPending}
          type="submit"
          color="primary"
          size="lg"
          startContent={isPending ? null : <CloudArrowDown size={20} />}
        >
          {isPending ? 'Chargement de la vidéo...' : 'Charger la vidéo'}
        </Button>
        <span
          aria-live="polite"
          className="text-center text-tiny text-white p-1 min-h-6 block"
        >
          {formState.status === 'error' && formState.errorMessage && !isPending
            ? formState.errorMessage
            : ''}
        </span>
      </div>
    </form>
  )
}

export default FormTwitterLink
