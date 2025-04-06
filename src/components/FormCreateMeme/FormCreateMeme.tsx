'use client'

import React from 'react'
import UploadDropzone from '@/components/UploadDropzone'
import { useFormStateCallback } from '@/hooks/useFormStateCallback'
import { useNotifications } from '@/hooks/useNotifications'
import {
  createMeme,
  type CreateMemeFormState
} from '@/serverActions/createMeme'
import { Button, Input } from '@heroui/react'
import type { Meme } from '@prisma/client'

export type FormCreateMemeProps = {
  meme?: Meme
}

const initialState = {
  status: 'idle'
} as CreateMemeFormState

const FormCreateMeme = () => {
  const { notifySuccess, notifyError } = useNotifications()
  const [formState, formAction, isPending] = React.useActionState(
    createMeme,
    initialState
  )

  useFormStateCallback(formState, {
    isError: (values) => {
      return values.status === 'error' && values.errorMessage ? values : false
    },
    isSuccess: (values) => {
      return values.status === 'success' ? values : false
    },
    onError: (values) => {
      notifyError(values.errorMessage)
    },
    onSuccess: () => {
      notifySuccess('Mème ajouté avec succès !')
    }
  })

  const formErrors = formState.status === 'error' ? formState.formErrors : null

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
      <Input
        label="Twitter URL"
        name="tweetUrl"
        defaultValue=""
        className="w-full"
        isInvalid={Boolean(formErrors?.fieldErrors.tweet?.[0])}
        errorMessage={formErrors?.fieldErrors.tweet?.[0]}
        labelPlacement="inside"
      />
      <UploadDropzone
        isInvalid={Boolean(formErrors?.fieldErrors.video?.[0])}
        errorMessage={formErrors?.fieldErrors.video?.[0]}
        inputProps={{ name: 'video', accept: 'video/*' }}
      />
      <div className="w-full flex flex-col">
        <Button isLoading={isPending} type="submit" color="primary" size="lg">
          Ajouter le mème
        </Button>
      </div>
    </form>
  )
}

export default FormCreateMeme
