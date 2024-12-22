'use client'

import React from 'react'
import UploadDropzone from '@/components/UploadDropzone'
import { useFormStateCallback } from '@/hooks/useFormStateCallback'
import { useNotifications } from '@/hooks/useNotifications'
import {
  createMeme,
  type CreateMemeFormState
} from '@/serverActions/createMeme'
import { Button, Input } from '@nextui-org/react'
import type { Meme } from '@prisma/client'

export type FormCreateMemeProps = {
  meme?: Meme
}

const initialState = {
  status: 'idle'
} as CreateMemeFormState

const FormCreateMeme = () => {
  const { notifySuccess, notifyError } = useNotifications()
  const [formState, formAction, isFormPending] = React.useActionState(
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
      <legend className="text-small text-gray-300">
        Ajouter un mème via un fichier local depuis votre appareil.
      </legend>
      <Input
        label="Titre"
        isRequired
        name="title"
        defaultValue=""
        variant="bordered"
        className="w-full"
        isInvalid={Boolean(formErrors?.fieldErrors.title?.[0])}
        errorMessage={formErrors?.fieldErrors.title?.[0]}
        labelPlacement="inside"
      />
      <UploadDropzone
        isInvalid={Boolean(formErrors?.fieldErrors.video?.[0])}
        errorMessage={formErrors?.fieldErrors.video?.[0]}
      />
      <div className="w-full flex flex-col">
        <Button
          isLoading={isFormPending}
          type="submit"
          color="primary"
          size="lg"
        >
          Ajouter le mème
        </Button>
      </div>
    </form>
  )
}

export default FormCreateMeme
