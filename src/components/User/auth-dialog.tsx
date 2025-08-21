import React from 'react'
import { CheckCircle, CircleAlert } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/animate-ui/radix/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { Separator } from '@/components/ui/separator'
import { authClient, getErrorMessage } from '@/lib/auth-client'
import { getAuthUserQueryOpts } from '@/lib/queries'
import { getFieldErrorMessage } from '@/lib/utils'
import { formOptions, useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'

type FormProps = {
  onOpenChange: (open: boolean) => void
}

const loginSchema = z.object({
  email: z.string(),
  password: z.string()
})

const loginFormOpts = formOptions({
  defaultValues: {
    email: '',
    password: ''
  },
  validators: {
    onChange: loginSchema
  }
})

const LoginForm = ({ onOpenChange }: FormProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [emailIsNotValid, setEmailIsNotValid] = React.useState(false)

  const form = useForm({
    ...loginFormOpts,
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          rememberMe: true
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries(getAuthUserQueryOpts())
            router.invalidate()
            onOpenChange(false)
          },
          onError: (context) => {
            if (context.error.code === 'EMAIL_NOT_VERIFIED') {
              setEmailIsNotValid(true)
            } else {
              toast.error(getErrorMessage(context.error, 'fr'))
            }
          }
        }
      )
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
      <h1 className="text-xl font-semibold">Connexion</h1>
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
      <form.Field
        name="password"
        children={(field) => {
          const errorMessage = getFieldErrorMessage({ field })

          return (
            <FormItem error={errorMessage}>
              <FormControl>
                <Input
                  required
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  placeholder="Mot de passe"
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
              Se connecter
            </LoadingButton>
          )
        }}
      />
      <Link
        to="/password/reset"
        className="underline"
        onClick={() => {
          return onOpenChange(false)
        }}
      >
        Mot de passe oublié ?
      </Link>
      {emailIsNotValid ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Vous devez vérifier votre email !</AlertTitle>
          <AlertDescription>
            Votre compte n’est pas activé. Veuillez l’activer avant d’essayer de
            vous connecter. Si vous avez besoin d’aide, contactez-nous.
          </AlertDescription>
        </Alert>
      ) : null}
    </form>
  )
}

const signupSchema = z
  .object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20)
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword
    },
    {
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword']
    }
  )

const signupFormOpts = formOptions({
  defaultValues: {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  validators: {
    onChange: signupSchema
  }
})

const SignupForm = () => {
  const form = useForm({
    ...signupFormOpts,
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
          callbackURL: '/'
        },
        {
          onError: (context) => {
            toast.error(getErrorMessage(context.error, 'fr'))
          },
          onSuccess: () => {
            form.reset()
          }
        }
      )
    }
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
      noValidate
      className="flex w-full flex-col items-center gap-y-4"
    >
      <h1 className="text-xl font-semibold">Inscription</h1>
      <form.Field
        name="name"
        children={(field) => {
          const errorMessage = getFieldErrorMessage({ field })

          return (
            <FormItem error={errorMessage}>
              <FormControl>
                <Input
                  required
                  type="text"
                  id="name"
                  autoComplete="username"
                  placeholder="Pseudo"
                  name="name"
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
      <form.Field
        name="password"
        children={(field) => {
          const errorMessage = getFieldErrorMessage({ field })

          return (
            <FormItem error={errorMessage}>
              <FormControl>
                <Input
                  required
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  placeholder="Mot de passe"
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
              <FormControl>
                <Input
                  required
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Confirmer le mot de passe"
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
              Créer un compte
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
              <CheckCircle />
              <AlertTitle>
                Parfait, plus qu&apos;à valider ton email !
              </AlertTitle>
              <AlertDescription>
                Votre compte a été créé avec succès, mais il doit être activé
                avant que vous puissiez vous connecter. Nous venons de vous
                envoyer un e-mail pour l’activer. Si vous ne le recevez pas dans
                quelques minutes, veuillez vérifier votre dossier spam ou
                contactez-nous.
              </AlertDescription>
            </Alert>
          ) : null
        }}
      />
    </form>
  )
}

export const AuthDialog = ({
  open,
  onOpenChange
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const [authType, setAuthType] = React.useState<'login' | 'signup'>('login')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className="px-6 py-4">
          {authType === 'login' ? (
            <LoginForm onOpenChange={onOpenChange} />
          ) : (
            <SignupForm />
          )}
        </div>
        <Separator />
        <div>
          <div className="text-gray-300 flex flex-col items-center justify-center gap-2 text-sm">
            {authType === 'login' ? (
              <p>Pas de compte ?</p>
            ) : (
              <p>Déjà un utilisateur ?</p>
            )}
            {authType === 'login' ? (
              <Button
                variant="secondary"
                onClick={(event) => {
                  event.preventDefault()
                  setAuthType('signup')
                }}
              >
                Créer un compte
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={(event) => {
                  event.preventDefault()
                  setAuthType('login')
                }}
              >
                Se connecter
              </Button>
            )}
          </div>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
