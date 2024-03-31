'use client'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import UploadDropzone from '@/components/UploadDropzone'
import { createMeme, type FormStateValue } from '@/serverActions/createMeme'
import { Button, Input } from '@nextui-org/react'

const SubmitButton = ({ formState }: { formState: FormStateValue }) => {
  const status = useFormStatus()

  return (
    <div className="w-full flex flex-col">
      <Button
        isLoading={status.pending}
        type="submit"
        color="primary"
        size="lg"
      >
        Ajouter le mème
      </Button>
      <span
        aria-live="polite"
        className="text-center text-tiny text-danger p-1 min-h-6 block"
      >
        {!formState.success && formState.errorMessage && !status.pending
          ? formState.errorMessage
          : ''}
      </span>
    </div>
  )
}

const initialState: FormStateValue = {
  errorMessage: '',
  success: false,
  formErrors: null
}

const FormCreateMeme = () => {
  const [formState, formAction] = useFormState(createMeme, initialState)
  const formErrors = formState.success ? null : formState.formErrors

  return (
    <form action={formAction} className="w-full flex flex-col gap-4">
      <Input
        label="Titre"
        isRequired
        name="title"
        defaultValue=""
        className="w-full"
        isInvalid={Boolean(formErrors?.fieldErrors.title?.[0])}
        errorMessage={formErrors?.fieldErrors.title?.[0]}
        labelPlacement="inside"
      />
      <UploadDropzone
        isInvalid={Boolean(formErrors?.fieldErrors.video?.[0])}
        errorMessage={formErrors?.fieldErrors.video?.[0]}
        inputProps={{ name: 'video', accept: 'video/*' }}
      />
      <SubmitButton formState={formState} />
    </form>
  )
}

export default FormCreateMeme
