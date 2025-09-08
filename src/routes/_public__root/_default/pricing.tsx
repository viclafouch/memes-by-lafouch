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
import { PRODUCT_ID } from '@/constants/polar'
import { usePortal } from '@/hooks/use-portal'
import { getActiveSubscriptionQueryOpts } from '@/lib/queries'
import { cn } from '@/lib/utils'
import {
  PageDescription,
  PageHeading
} from '@/routes/_public__root/-components/page-headers'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

type Plan = {
  title: string
  productId: string
  monthlyPrice: number
  description: string
  features: string[]
  isExclusive?: boolean
}

const CheckItem = ({ text }: { text: string }) => {
  return (
    <div className="flex gap-2">
      <CheckCircle2 size={18} className="my-auto text-green-400" />
      <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
    </div>
  )
}

const PricingCard = ({
  title,
  monthlyPrice,
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
            <h3 className="text-3xl font-bold">{`€${monthlyPrice}`}</h3>
            <span className="flex flex-col justify-end text-sm mb-1">
              /month
            </span>
          </div>
          <CardDescription className="pt-1.5 h-12">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {features.map((feature: string) => {
            return <CheckItem key={feature} text={feature} />
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
            Current plan
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
      <PageDescription>A collection of memes from the internet</PageDescription>
      <div className="w-full mx-auto py-10">
        <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 sm:max-w-2xl mx-auto max-w-md">
          <PricingCard
            title="Free"
            monthlyPrice={0}
            onChangePlan={() => {
              return goToPortal()
            }}
            productId="free"
            description="Essential features you need to get started"
            features={[
              'Example Feature Number 1',
              'Example Feature Number 2',
              'Example Feature Number 3'
            ]}
            isActive={Boolean(
              user !== null && activeSubscriptionQuery.data === null
            )}
          />
          <PricingCard
            title="Pro"
            isExclusive
            onChangePlan={() => {
              return checkoutPortal()
            }}
            monthlyPrice={3.99}
            productId={PRODUCT_ID}
            description="Essential features you need to get started"
            features={[
              'Example Feature Number 1',
              'Example Feature Number 2',
              'Example Feature Number 3'
            ]}
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
