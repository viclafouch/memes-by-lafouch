import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { FREE_PLAN, type Plan, PREMIUM_PLAN } from '@/constants/plan'
import { formatCentsToEuros } from '@/helpers/number'
import { usePortal } from '@/hooks/use-portal'
import { getActiveSubscriptionQueryOpts } from '@/lib/queries'
import { cn } from '@/lib/utils'
import {
  PageDescription,
  PageHeading
} from '@/routes/_public__root/-components/page-headers'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

const StatusColorByFeatureStatus = {
  included: 'text-green-400',
  limited: 'text-yellow-400',
  // eslint-disable-next-line camelcase
  not_included: 'text-red-400'
} satisfies Record<Plan['features'][number]['status'], string>

const CheckItem = ({ feature }: { feature: Plan['features'][number] }) => {
  return (
    <div className="flex gap-2">
      <CheckCircle2
        size={18}
        className={cn('my-auto', StatusColorByFeatureStatus[feature.status])}
      />
      <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">
        {feature.label}{' '}
        {feature.note ? (
          <span className="text-muted-foreground text-xs">{`(${feature.note})`}</span>
        ) : null}
      </p>
    </div>
  )
}

const PricingCard = ({
  title,
  monthlyPriceInCents,
  description,
  features,
  productId,
  isExclusive = false,
  isActive,
  onChangePlan
}: Plan & {
  isActive: boolean
  onChangePlan: (productId: string) => void
}) => {
  return (
    <Card
      className={cn(
        `flex flex-col justify-between py-1 border-zinc-700 flex-1`,
        {
          'animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors':
            isExclusive && !isActive
        }
      )}
    >
      <div>
        <CardHeader className="pb-8 pt-4">
          <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
            {title}
          </CardTitle>
          <div className="flex gap-0.5">
            <h3 className="text-3xl font-bold">
              {formatCentsToEuros(monthlyPriceInCents)}
            </h3>
            <span className="flex flex-col justify-end text-sm mb-1">
              /mois
            </span>
          </div>
          <CardDescription className="pt-1.5">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {features.map((feature) => {
            return <CheckItem key={feature.label} feature={feature} />
          })}
        </CardContent>
      </div>
      <CardFooter className="mt-2">
        {isActive ? (
          <Button
            onClick={(event) => {
              event.preventDefault()
              onChangePlan(productId)
            }}
            className="w-full"
            variant="secondary"
            disabled={isActive}
          >
            Actif
          </Button>
        ) : (
          <Button
            onClick={(event) => {
              event.preventDefault()
              onChangePlan(productId)
            }}
            className="w-full"
          >
            Mettre à niveau
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

const RouteComponent = () => {
  const { user } = useRouteContext({ from: '__root__' })
  const { goToPortal, checkoutPortal } = usePortal()

  const activeSubscriptionQuery = useSuspenseQuery(
    getActiveSubscriptionQueryOpts()
  )

  return (
    <div>
      <PageHeading>Plans</PageHeading>
      <PageDescription>
        Choisissez l’offre qui correspond à vos besoins, du gratuit à
        l’illimité.
      </PageDescription>
      <div className="w-full mx-auto py-10">
        <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 sm:max-w-2xl mx-auto max-w-md">
          <PricingCard
            {...FREE_PLAN}
            onChangePlan={() => {
              return goToPortal()
            }}
            isActive={Boolean(
              user !== null && activeSubscriptionQuery.data === null
            )}
          />
          <PricingCard
            {...PREMIUM_PLAN}
            onChangePlan={() => {
              return checkoutPortal()
            }}
            isActive={Boolean(
              user !== null && activeSubscriptionQuery.data !== null
            )}
          />
        </section>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_public__root/_default/pricing')({
  component: RouteComponent
})
