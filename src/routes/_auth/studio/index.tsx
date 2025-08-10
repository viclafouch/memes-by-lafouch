import { StarsBackground } from '@/components/animate-ui/backgrounds/stars'
import { Sheet, SheetTrigger } from '@/components/animate-ui/radix/sheet'
import { StudioMobileSheet } from '@/components/studio/studio-mobile-sheet'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <div className="relative w-full flex flex-col gap-4 h-full">
      <StarsBackground className="flex absolute inset-0 items-center justify-center">
        <div className="z-10 space-y-4 lg:space-y-6 text-center flex flex-col items-center justify-center px-4">
          <h4 className="mb-4 max-w-(--breakpoint-md) text-3xl leading-12 md:leading-16 font-extrabold tracking-tight md:text-5xl font-bricolage">
            Customiser votre mème
          </h4>
          <p className="max-w-(--breakpoint-md) text-lg leading-8 md:text-xl text-muted-foreground">
            A large collection of admin dashboards, website templates, UI
            components, and ready-to-use blocks. Save time and deliver projects
            faster.
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" variant="default">
                Choisir mon mème
              </Button>
            </SheetTrigger>
            <StudioMobileSheet />
          </Sheet>
        </div>
      </StarsBackground>
    </div>
  )
}

export const Route = createFileRoute('/_auth/studio/')({
  component: RouteComponent,
  loader: async () => {
    return {
      crumb: 'Studio'
    }
  }
})
