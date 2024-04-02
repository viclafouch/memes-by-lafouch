'use client'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useSnackbar } from 'notistack'
import UploadDropzone from '@/components/UploadDropzone'
import { useFormStateCallback } from '@/hooks/useFormStateCallback'
import {
  createMeme,
  type CreateMemeFormState
} from '@/serverActions/createMeme'
import {
  updateMeme,
  type UpdateMemeFormState
} from '@/serverActions/updateMeme'
import { Button, Input } from '@nextui-org/react'
import { Meme } from '@prisma/client'

const SubmitButton = ({ isEdit }: { isEdit: boolean }) => {
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
    </div>
  )
}

export type FormManageMemeProps = {
  meme?: Meme
}

const initialState = {
  status: 'idle'
} as CreateMemeFormState | UpdateMemeFormState

const FormManageMeme = ({ meme = undefined }: FormManageMemeProps) => {
  const isEditMode = Boolean(meme)
  const { enqueueSnackbar } = useSnackbar()
  const [formState, formAction] = useFormState(
    meme ? updateMeme : createMeme,
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
      enqueueSnackbar({
        message: values.errorMessage,
        variant: 'error'
      })
    },
    onSuccess: () => {
      enqueueSnackbar({
        message: isEditMode
          ? 'Mème mis à jour avec succès !'
          : 'Mème ajouté avec succès !',
        variant: 'success'
      })
    }
  })

  const formErrors = formState.status === 'error' ? formState.formErrors : null

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
      <Input
        label="Twitter URL"
        name="twitterUrl"
        defaultValue={meme?.twitterUrl || ''}
        className="w-full"
        isReadOnly={Boolean(meme?.twitterUrl)}
        isDisabled={Boolean(meme?.twitterUrl)}
        isInvalid={Boolean(formErrors?.fieldErrors.twitterUrl?.[0])}
        errorMessage={formErrors?.fieldErrors.twitterUrl?.[0]}
        labelPlacement="inside"
      />
      {!meme ? (
        <UploadDropzone
          // @ts-expect-error
          isInvalid={Boolean(formErrors?.fieldErrors.video?.[0])}
          // @ts-expect-error
          errorMessage={formErrors?.fieldErrors.video?.[0]}
          inputProps={{ name: 'video', accept: 'video/*' }}
        />
      ) : (
        <video
          controls
          className="w-full max-h-72 object-cover rounded-lg"
          src={meme.videoUrl}
          width={270}
          preload="metadata"
          height={200}
        />
      )}
      <SubmitButton isEdit={isEditMode} />
    </form>
  )
}

export default FormManageMeme
