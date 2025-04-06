'use client'

import React from 'react'
import { useAction } from 'next-safe-action/hooks'
import { useNotifications } from '@/hooks/useNotifications'
import { getTweetFromLink } from '@/serverActions/download-tweet'
import { downloadBlob } from '@/utils/download'
import { Button, Form, Input } from '@heroui/react'

const FormDownloadTweet = () => {
  const { notifyError } = useNotifications()

  const { execute, result, isPending } = useAction(getTweetFromLink, {
    onError: ({ error }) => {
      if (error.serverError) {
        notifyError(error.serverError)
      }
    },
    onSuccess: ({ data }) => {
      if (data) {
        downloadBlob(data.video.blob, `${data.id}.mp4`)
      }
    }
  })

  return (
    <Form
      action={execute}
      validationErrors={result.validationErrors}
      className="w-full flex flex-col gap-4"
    >
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
    </Form>
  )
}

export default FormDownloadTweet
