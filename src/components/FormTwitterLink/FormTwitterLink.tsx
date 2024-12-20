'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'
import {
  type ExtractTwitterFormState,
  extractTwitterLink
} from '@/serverActions/extractTwitterLink'
import { Button, Input } from '@nextui-org/react'
import { CloudArrowDown, Link as LinkIcon } from '@phosphor-icons/react'

const SubmitButton = ({
  formState
}: {
  formState: ExtractTwitterFormState
}) => {
  const status = useFormStatus()

  return (
    <div className="w-full flex flex-col">
      <Button
        isLoading={status.pending}
        type="submit"
        color="primary"
        size="lg"
        startContent={status.pending ? null : <CloudArrowDown size={20} />}
      >
        {status.pending ? 'Chargement de la vidéo...' : 'Charger la vidéo'}
      </Button>
      <span
        aria-live="polite"
        className="text-center text-tiny text-white p-1 min-h-6 block"
      >
        {formState.status === 'error' &&
        formState.errorMessage &&
        !status.pending
          ? formState.errorMessage
          : ''}
      </span>
    </div>
  )
}

const initialState: ExtractTwitterFormState = {
  status: 'idle'
}

const FormTwitterLink = () => {
  const [formState, formAction] = React.useActionState(
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
      <SubmitButton formState={formState} />
    </form>
  )
}

export default FormTwitterLink
