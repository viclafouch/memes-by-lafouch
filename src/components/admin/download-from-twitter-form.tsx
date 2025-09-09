import React from 'react'
import { ClipboardPaste } from 'lucide-react'
import { z } from 'zod'
import { IconButton } from '@/components/animate-ui/buttons/icon'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { TWEET_LINK_SCHEMA } from '@/constants/meme'
import { getTweetMedia } from '@/lib/react-tweet'
import { getFieldErrorMessage } from '@/lib/utils'
import { getTweetFromUrl } from '@/server/twitter'
import { downloadBlob } from '@/utils/download'
import { formOptions, useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'

const formSchema = z.object({ url: TWEET_LINK_SCHEMA })

const formOpts = formOptions({
  defaultValues: {
    url: ''
  },
  validators: {
    onChange: formSchema
  }
})

export const DownloadFromTwitterForm = () => {
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      if (downloadFileFromTweet.isPending) {
        return
      }

      await downloadFileFromTweet.mutateAsync({
        url: value.url
      })
    }
  })

  const clipboardMutation = useMutation({
    mutationFn: () => {
      return navigator.clipboard.readText()
    },
    onSuccess: (text) => {
      form.setFieldValue('url', text.trim())
    }
  })

  const handlePasteFromClipboard = async () => {
    clipboardMutation.mutateAsync().finally(() => {
      setTimeout(() => {
        clipboardMutation.reset()
      }, 3000)
    })
  }

  const downloadFileFromTweet = useMutation({
    mutationKey: ['download-file-from-tweet'],
    mutationFn: (body: { url: string }) => {
      return getTweetFromUrl({ data: body.url })
    },
    onSuccess: async (tweet) => {
      const medias = await getTweetMedia(tweet.video.url, tweet.poster.url)
      downloadBlob(medias.video.blob, `${tweet.id}.mp4`)
    }
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
      noValidate
    >
      <Card className="md:max-w-lg">
        <CardHeader>
          <CardTitle>Télécharger une vidéo depuis un tweet</CardTitle>
          <CardDescription>
            Ajouter un mème à la bibliothèque depuis un tweet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <form.Field
              name="url"
              children={(field) => {
                const errorMessage = getFieldErrorMessage({ field })

                return (
                  <FormItem error={errorMessage}>
                    <FormLabel>Tweet URL</FormLabel>
                    <div className="relative w-full">
                      <FormControl>
                        <Input
                          required
                          type="text"
                          id="twitter-link"
                          name="twitter-link"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            return field.handleChange(event.target.value)
                          }}
                        />
                      </FormControl>
                      <IconButton
                        icon={ClipboardPaste}
                        active={
                          clipboardMutation.isPending ||
                          clipboardMutation.isSuccess
                        }
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 size-6"
                        onClick={handlePasteFromClipboard}
                        type="button"
                        onlyStars
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <form.Subscribe
            selector={(state) => {
              return [state.canSubmit, state.isSubmitting]
            }}
            children={([canSubmit, isSubmitting]) => {
              return (
                <LoadingButton isLoading={isSubmitting} disabled={!canSubmit}>
                  Extraire et télécharger
                </LoadingButton>
              )
            }}
          />
        </CardFooter>
      </Card>
    </form>
  )
}
