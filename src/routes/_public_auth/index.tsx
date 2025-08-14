import React from 'react'
import { Demo } from '@/routes/_public_auth/-components/demo'
import { Hero } from '@/routes/_public_auth/-components/hero'
import { PageContainer } from '@/routes/_public_auth/-components/page-headers'
import { createFileRoute } from '@tanstack/react-router'

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

export const Route = createFileRoute('/_public_auth/')({
  component: RouteComponent
})
