'use client'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useFormStateCallback } from '@/hooks/useFormStateCallback'
import { deleteMeme, DeleteMemeFormState } from '@/serverActions/deleteMeme'
import { Button, ButtonProps } from '@nextui-org/react'
import { Meme } from '@prisma/client'

const SubmitButton = ({ ...restButtonProps }: ButtonProps) => {
  const status = useFormStatus()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // eslint-disable-next-line no-alert
    if (!confirm('Confirmer la suppression ?')) {
      event.preventDefault()
    }
  }

  return (
    <Button
      isLoading={status.pending}
      type="submit"
      color="danger"
      size="lg"
      onClick={handleClick}
      {...restButtonProps}
    />
  )
}

const initialState: DeleteMemeFormState = {
  status: 'idle'
}

export type DeleteMemeButtonProps = {
  meme: Meme
} & ButtonProps

const DeleteMemeButton = ({
  meme,
  ...restButtonProps
}: DeleteMemeButtonProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const [formState, formAction] = useFormState(deleteMeme, initialState)

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
        message: 'Mème supprimé avec succès !',
        variant: 'success'
      })
      router.replace('/library')
    }
  })

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={meme.id} />
      <SubmitButton {...restButtonProps} />
    </form>
  )
}

export default DeleteMemeButton
