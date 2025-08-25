import React from 'react'
import { getRecentCountMemesQueryOpts } from '@/lib/queries'
import { createFileRoute } from '@tanstack/react-router'
import { Demo } from './-components/demo'
import { Hero } from './-components/hero'
import { PageContainer } from './-components/page-headers'

const RouteComponent = () => {
  return (
    <PageContainer>
      <section className="flex w-full flex-col gap-16 py-30 pb-10 sm:pt-42">
        <Hero />
        <Demo />
      </section>
    </PageContainer>
  )
}

export const Route = createFileRoute('/_public__root/')({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(getRecentCountMemesQueryOpts())

    return {}
  }
})
