import React from 'react'
import { CircleAlert } from 'lucide-react'
import { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { authClient } from '@/lib/auth-client'
import { getFieldErrorMessage } from '@/lib/utils'
import { formOptions, useForm } from '@tanstack/react-form'

const resetPasswordSchema = z.object({
  email: z.string()
})

const loginFormOpts = formOptions({
  defaultValues: {
    email: ''
  },
  validators: {
    onChange: resetPasswordSchema
  }
})

export const ResetPasswordForm = () => {
  const form = useForm({
    ...loginFormOpts,
    onSubmit: async ({ value }) => {
      await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: '/password/create-new'
      })
      form.reset()
    }
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
      noValidate
      className="flex flex-col items-center gap-y-4 w-full"
    >
      <h1 className="text-xl font-semibold text-center text-balance">
        Demande de réinitialisation de mot de passe
      </h1>
      <form.Field
        name="email"
        children={(field) => {
          const errorMessage = getFieldErrorMessage({ field })

          return (
            <FormItem error={errorMessage}>
              <FormControl>
                <Input
                  required
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder="Email"
                  name="email"
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
              Confirmer
            </LoadingButton>
          )
        }}
      />
      <form.Subscribe
        selector={(state) => {
          return state.isSubmitted
        }}
        children={(isSubmitted) => {
          return isSubmitted ? (
            <Alert variant="success">
              <CircleAlert />
              <AlertTitle>Vérifiez votre email !</AlertTitle>
              <AlertDescription>
                C’est tout bon ! Si nous trouvons un compte associé à cette
                adresse e-mail, vous recevrez d’ici quelques minutes un lien
                pour réinitialiser votre mot de passe.
              </AlertDescription>
            </Alert>
          ) : null
        }}
      />
    </form>
  )
}
