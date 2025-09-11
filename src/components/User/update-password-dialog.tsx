import React from 'react'
import type { User } from 'better-auth'
import type { ErrorContext } from 'better-auth/react'
import { CircleAlert } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import type { WithDialog } from '@/@types/dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/animate-ui/radix/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { authClient, getErrorMessage } from '@/lib/auth-client'
import { getFieldErrorMessage } from '@/lib/utils'
import { formOptions, useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().nonempty(),
    newPassword: z.string().min(4),
    confirmPassword: z.string().min(4)
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmPassword
    },
    {
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword']
    }
  )

const updatePasswordFormOpts = formOptions({
  defaultValues: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  },
  validators: {
    onChange: updatePasswordSchema
  }
})

const UpdatePasswordForm = () => {
  const updatePasswordMutation = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword
    }: {
      currentPassword: string
      newPassword: string
    }) => {
      return new Promise((resolve, reject) => {
        authClient.changePassword(
          {
            currentPassword,
            newPassword
          },
          { onError: reject, onSuccess: resolve }
        )
      })
    },
    onSuccess: async () => {
      form.reset()
    },
    onError: (context: Error | ErrorContext) => {
      if ('error' in context) {
        toast.error(getErrorMessage(context.error, 'fr'))
      } else {
        toast.error(getErrorMessage(context, 'fr'))
      }
    }
  })

  const form = useForm({
    ...updatePasswordFormOpts,
    onSubmit: async ({ value }) => {
      if (!updatePasswordMutation.isPending) {
        return updatePasswordMutation.mutateAsync({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword
        })
      }

      return () => {}
    }
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
      noValidate
      className="flex flex-col items-center gap-y-6 w-full"
    >
      <div className="flex flex-col items-center gap-y-4 w-full">
        <form.Field
          name="currentPassword"
          children={(field) => {
            const errorMessage = getFieldErrorMessage({ field })

            return (
              <FormItem error={errorMessage}>
                <FormLabel>Votre mot de passe</FormLabel>
                <FormControl>
                  <Input
                    required
                    type="password"
                    id="current-password"
                    autoComplete="current-password"
                    placeholder="******"
                    name="current-password"
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
        <form.Field
          name="newPassword"
          children={(field) => {
            const errorMessage = getFieldErrorMessage({ field })

            return (
              <FormItem error={errorMessage}>
                <FormLabel>Votre nouveau mot de passe</FormLabel>
                <FormControl>
                  <Input
                    required
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    placeholder="*******"
                    name="password"
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
        <form.Field
          name="confirmPassword"
          children={(field) => {
            const errorMessage = getFieldErrorMessage({ field })

            return (
              <FormItem error={errorMessage}>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input
                    required
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    placeholder="******"
                    name="confirmPassword"
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
        <form.Subscribe
          selector={(state) => {
            return state.isSubmitting
          }}
          children={(isSubmitting) => {
            return (
              <LoadingButton
                isLoading={isSubmitting}
                type="submit"
                className="w-full"
              >
                Modifier
              </LoadingButton>
            )
          }}
        />
        <form.Subscribe
          selector={(state) => {
            return state.isSubmitted
          }}
          children={(isSubmitted) => {
            return isSubmitted && updatePasswordMutation.isSuccess ? (
              <Alert variant="success" className="mt-4">
                <CircleAlert />
                <AlertTitle>Votre mot de passe a bien été modifié !</AlertTitle>
                <AlertDescription>
                  Parfait ! Votre mot de passe a bien été mis à jour. Vous
                  pouvez dès maintenant vous connecter avec vos nouveaux
                  identifiants.
                </AlertDescription>
              </Alert>
            ) : null
          }}
        />
      </div>
    </form>
  )
}

export const UpdatePasswordDialog = ({
  open,
  onOpenChange
}: WithDialog<{ user: User }>) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier mon mot de passe</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div>
          <UpdatePasswordForm />
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
