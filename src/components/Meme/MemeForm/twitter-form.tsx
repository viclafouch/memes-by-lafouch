import React from 'react'
import { ClipboardPaste } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { IconButtonStars } from '@/components/animate-ui/buttons/icon-button-stars'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TWEET_LINK_SCHEMA } from '@/constants/meme'
import { getFieldErrorMessage } from '@/lib/utils'
import { createMemeFromTwitterUrl } from '@/server/admin'
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

type TwitterFormProps = {
  onSuccess?: ({ memeId }: { memeId: string }) => void
  closeDialog: () => void
}

export const TwitterForm = ({ onSuccess, closeDialog }: TwitterFormProps) => {
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      if (createMemeFromTwitterUrlMutation.isPending) {
        return
      }

      await createMemeFromTwitterUrlMutation.mutateAsync({
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

  const createMemeFromTwitterUrlMutation = useMutation({
    mutationKey: ['createMemeFromTwitterUrl'],
    mutationFn: (body: { url: string }) => {
      const promise = createMemeFromTwitterUrl({ data: body.url })
      toast.promise(promise, {
        loading: 'Ajout en cours...',
        success: () => {
          return 'Mème créé avec succès !'
        },
        error: 'Une erreur est survenue'
      })
      closeDialog()

      return promise
    },
    onSuccess: (data) => {
      onSuccess?.({ memeId: data.id })
    }
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4"
      noValidate
    >
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
                      className="pr-9"
                      name="twitter-link"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        return field.handleChange(event.target.value)
                      }}
                    />
                  </FormControl>
                  <IconButtonStars
                    icon={ClipboardPaste}
                    active={
                      clipboardMutation.isPending || clipboardMutation.isSuccess
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
      <form.Subscribe
        selector={(state) => {
          return [state.canSubmit, state.isSubmitting]
        }}
        children={([canSubmit, isSubmitting]) => {
          return (
            <div className="w-full flex justify-end gap-x-2">
              <Button onClick={closeDialog} variant="outline" type="button">
                Annuler
              </Button>
              <Button
                variant="default"
                disabled={!canSubmit || isSubmitting}
                type="submit"
              >
                Ajouter
              </Button>
            </div>
          )
        }}
      />
    </form>
  )
}
