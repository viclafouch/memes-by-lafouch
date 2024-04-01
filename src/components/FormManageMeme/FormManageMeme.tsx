'use client'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import UploadDropzone from '@/components/UploadDropzone'
import { createMeme, type FormStateValue } from '@/serverActions/createMeme'
import { updateMeme } from '@/serverActions/updateMeme'
import { Button, Input } from '@nextui-org/react'
import { Meme } from '@prisma/client'

const SubmitButton = ({
  formState,
  isEdit
}: {
  formState: FormStateValue
  isEdit: boolean
}) => {
  const status = useFormStatus()

  return (
    <div className="w-full flex flex-col">
      <Button
        isLoading={status.pending}
        type="submit"
        color="primary"
        size="lg"
      >
        {isEdit ? 'Modifier' : 'Ajouter'} le mème
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

export type FormManageMemeProps = {
  meme?: Meme
}

const FormManageMeme = ({ meme = undefined }: FormManageMemeProps) => {
  const [formState, formAction] = useFormState(
    meme ? updateMeme : createMeme,
    initialState
  )
  const formErrors = formState.success ? null : formState.formErrors

  return (
    <form action={formAction} className="w-full flex flex-col gap-4">
      {meme ? (
        <input type="hidden" className="hidden" name="id" value={meme.id} />
      ) : null}
      <Input
        label="Titre"
        isRequired
        name="title"
        defaultValue={meme?.title || ''}
        className="w-full"
        isInvalid={Boolean(formErrors?.fieldErrors.title?.[0])}
        errorMessage={formErrors?.fieldErrors.title?.[0]}
        labelPlacement="inside"
      />
      {!meme ? (
        <UploadDropzone
          isInvalid={Boolean(formErrors?.fieldErrors.video?.[0])}
          errorMessage={formErrors?.fieldErrors.video?.[0]}
          inputProps={{ name: 'video', accept: 'video/*' }}
        />
      ) : (
        <video
          controls
          className="w-full h-full object-cover rounded-lg"
          src={meme.videoUrl}
          width={270}
          preload="metadata"
          height={200}
        />
      )}
      <SubmitButton isEdit={Boolean(meme)} formState={formState} />
    </form>
  )
}

export default FormManageMeme
