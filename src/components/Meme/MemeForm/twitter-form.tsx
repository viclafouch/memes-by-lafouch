import React from 'react'
import { toast } from 'sonner'
import { z } from 'zod/v4'
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
import { createMemeFromTwitterUrl } from '@/server/meme'
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
  onSuccess?: () => void
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
    onSuccess: () => {
      onSuccess?.()
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
