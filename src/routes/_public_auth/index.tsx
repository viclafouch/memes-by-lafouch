import React from 'react'
import { Demo } from '@/routes/_public_auth/-components/demo'
import { Hero } from '@/routes/_public_auth/-components/hero'
import { PageContainer } from '@/routes/_public_auth/-components/page-headers'
import { getBestMemes } from '@/server/ai'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { memes } = Route.useLoaderData()

  return (
    <PageContainer>
      <section className="flex w-full flex-col gap-16">
        <Hero />
        <Demo memes={memes} />
      </section>
    </PageContainer>
  )
}

export const Route = createFileRoute('/_public_auth/')({
  component: RouteComponent,
  loader: async () => {
    const memes = await getBestMemes()

    return {
      memes: memes.map((meme) => {
        return {
          ...meme,
          isBookmarked: false
        }
      })
    }
  }
})
