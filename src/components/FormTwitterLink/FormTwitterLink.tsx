'use client'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import {
  extractTwitterLink,
  FormStateValue
} from '@/serverActions/extractTwitterLink'
import { Button, Input } from '@nextui-org/react'
import { CloudArrowDown, Link as LinkIcon } from '@phosphor-icons/react'

const SubmitButton = ({ formState }: { formState: FormStateValue }) => {
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
        className="text-center text-tiny text-danger p-1 min-h-6 block"
      >
        {formState &&
        !formState.success &&
        formState.errorMessage &&
        !status.pending
          ? formState.errorMessage
          : ''}
      </span>
    </div>
  )
}

const initialState: FormStateValue = null

const FormTwitterLink = () => {
  const [formState, formAction] = useFormState(extractTwitterLink, initialState)

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
