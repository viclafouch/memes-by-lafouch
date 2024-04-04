'use client'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useSnackbar } from 'notistack'
import { useFormStateCallback } from '@/hooks/useFormStateCallback'
import { updateMeme, UpdateMemeFormState } from '@/serverActions/updateMeme'
import { Button, ButtonProps, Input } from '@nextui-org/react'
import { Meme } from '@prisma/client'

export type FormUpdateMemeProps = {
  meme: Meme
}

const SubmitButton = ({ ...restButtonProps }: ButtonProps) => {
  const status = useFormStatus()

  return (
    <Button
      isLoading={status.pending}
      type="submit"
      size="lg"
      color="primary"
      className="w-full"
      {...restButtonProps}
    >
      Enregistrer
    </Button>
  )
}

const initialState: UpdateMemeFormState = {
  status: 'idle'
}

const FormUpdateMeme = ({ meme }: FormUpdateMemeProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const [formState, formAction] = useFormState(updateMeme, initialState)

  useFormStateCallback(formState, {
    isError: (values) => {
      return values.status === 'error' && values.errorMessage ? values : false
    },
    isSuccess: (values) => {
      return values.status === 'success' ? values : false
    },
    onError: (values) => {
      enqueueSnackbar({
        message: values.errorMessage,
        variant: 'error'
      })
    },
    onSuccess: () => {
      enqueueSnackbar({
        message: 'Mème mis à jour avec succès !',
        variant: 'success'
      })
    }
  })

  const formErrors = formState.status === 'error' ? formState.formErrors : null

  return (
    <form action={formAction} className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-col gap-6">
        <input type="hidden" name="id" value={meme.id} />
        <Input
          isRequired
          label="Titre"
          name="title"
          defaultValue={meme.title}
          isInvalid={Boolean(formErrors?.fieldErrors.title?.[0])}
          errorMessage={formErrors?.fieldErrors.title?.[0]}
          labelPlacement="outside"
        />
        <Input
          label="Twitter URL"
          name="twitterUrl"
          isClearable
          defaultValue={meme.twitterUrl || ''}
          isInvalid={Boolean(formErrors?.fieldErrors.twitterUrl?.[0])}
          errorMessage={formErrors?.fieldErrors.twitterUrl?.[0]}
          labelPlacement="outside"
        />
        <div className="w-full flex gap-6">
          <Input
            isDisabled
            label="Clef vidéo (uploadThing)"
            defaultValue={meme.videoKey}
            labelPlacement="outside"
          />
          <Input
            isDisabled
            label="Identifiant"
            defaultValue={meme.id}
            labelPlacement="outside"
          />
        </div>
      </div>
      <div className="w-full">
        <SubmitButton />
      </div>
    </form>
  )
}

export default FormUpdateMeme
