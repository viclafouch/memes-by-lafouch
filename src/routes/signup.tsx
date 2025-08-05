import { toast } from 'sonner'
import { z } from 'zod'
import { FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { authClient } from '@/lib/auth-client'
import { getFieldErrorMessage } from '@/lib/utils'
import { formOptions, useForm } from '@tanstack/react-form'
import { createFileRoute, Link } from '@tanstack/react-router'

const formSchema = z
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

const formOpts = formOptions({
  defaultValues: {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  validators: {
    onChange: formSchema
  }
})

const RouteComponent = () => {
  const navigate = Route.useNavigate()

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name
        },
        {
          onSuccess: () => {
            navigate({ to: '/library' })
          },
          onError: (context) => {
            toast.error(context.error.message)
          }
        }
      )
    }
  })

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          <Link to="/">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg"
              alt="Memes by Lafouch"
              className="h-10 dark:invert"
            />
          </Link>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              form.handleSubmit()
            }}
            noValidate
            className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md"
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
          </form>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Déjà un utilisateur ?</p>
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export const Route = createFileRoute('/signup')({
  component: RouteComponent
})
