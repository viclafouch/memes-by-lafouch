import React from 'react'
import { StarsBackground } from '@/components/animate-ui/backgrounds/stars'
import { AnimatedBanner } from '@/components/custom/animated-banner'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <StarsBackground>
      <div className="z-10 relative">
        <AnimatedBanner>
          This website is currently under construction.
        </AnimatedBanner>
        <Navbar />
        <main className="flex flex-1 flex-col py-30 pb-10 sm:pt-42 sm:pb-14">
          <Outlet />
        </main>
        <Footer />
      </div>
    </StarsBackground>
  )
}

export const Route = createFileRoute('/_public_auth')({
  component: RouteComponent
})
