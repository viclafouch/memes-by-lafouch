'use client'

import React from 'react'
import { useFormStateCallback } from '@/hooks/useFormStateCallback'
import { useNotifications } from '@/hooks/useNotifications'
import type { GetTweetFormLinkState } from '@/serverActions/download-tweet'
import { getTweetFromLink } from '@/serverActions/download-tweet'
import { downloadBlob } from '@/utils/download'
import { Button, Input } from '@heroui/react'

const initialState = {
  status: 'idle'
} as GetTweetFormLinkState

const FormDownloadTweet = () => {
  const { notifyError } = useNotifications()
  const [formState, formAction, isPending] = React.useActionState(
    getTweetFromLink,
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
    onSuccess: (values) => {
      downloadBlob(values.tweet.video.blob, `${values.tweet.id}.mp4`)
    }
  })

  return (
    <form action={formAction} className="w-full flex flex-col gap-4">
      <Input
        label="Twitter URL"
        name="tweetUrl"
        defaultValue=""
        required
        isRequired
        className="w-full"
        labelPlacement="inside"
      />
      <div className="w-full flex flex-col">
        <Button isLoading={isPending} type="submit" color="primary" size="lg">
          Extraire et télécharger
        </Button>
      </div>
    </form>
  )
}

export default FormDownloadTweet
