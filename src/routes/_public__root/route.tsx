import React from 'react'
import { StarsBackground } from '@/components/animate-ui/backgrounds/stars'
import { AnimatedBanner } from '@/components/custom/animated-banner'
import { FeedbackButton } from '@/components/feedback-button'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ClientOnly, createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <StarsBackground>
      <div className="z-10 relative min-h-dvh flex flex-col">
        <AnimatedBanner>
          This website is currently under construction.
        </AnimatedBanner>
        <Navbar />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ClientOnly>
        <FeedbackButton />
      </ClientOnly>
    </StarsBackground>
  )
}

export const Route = createFileRoute('/_public__root')({
  component: RouteComponent
})
