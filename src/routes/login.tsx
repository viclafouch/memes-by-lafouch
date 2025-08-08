import { toast } from 'sonner'
import { z } from 'zod'
import { StarsBackground } from '@/components/animate-ui/backgrounds/stars'
import { FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { authClient } from '@/lib/auth-client'
import { getAuthUserQueryOpts } from '@/lib/queries'
import { getFieldErrorMessage } from '@/lib/utils'
import { formOptions, useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

const formSchema = z.object({
  email: z.string(),
  password: z.string()
})

const formOpts = formOptions({
  defaultValues: {
    email: '',
    password: ''
  },
  validators: {
    onChange: formSchema
  }
})

const RouteComponent = () => {
  const navigate = Route.useNavigate()
  const queryClient = useQueryClient()

  const form = useForm({
    ...formOpts,
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
    <StarsBackground className="flex items-center justify-center">
      <section className="relative w-full h-screen">
        <div className="relative flex h-full items-center justify-center z-10">
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
            </form>
            <div className="text-gray-300 flex justify-center gap-1 text-sm">
              <p>Pas de compte ?</p>
              <Link to="/signup" className="font-medium underline">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </section>
    </StarsBackground>
  )
}

export const Route = createFileRoute('/login')({
  validateSearch: (search) => {
    return z.object({ redirect: z.string().optional() }).parse(search)
  },
  component: RouteComponent
})
