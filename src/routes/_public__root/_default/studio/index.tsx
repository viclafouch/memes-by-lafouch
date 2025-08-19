import { Sheet, SheetTrigger } from '@/components/animate-ui/radix/sheet'
import { StudioMobileSheet } from '@/components/studio/studio-mobile-sheet'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { PageDescription, PageHeading } from '../../-components/page-headers'

const RouteComponent = () => {
  return (
    <div className="relative w-full flex flex-col gap-4 h-full">
      <div className="z-10 space-y-4 lg:space-y-6 text-center flex flex-col items-center justify-center px-4">
        <PageHeading>Customiser votre mème</PageHeading>
        <PageDescription className="lg:max-w-3xl">
          A large collection of admin dashboards, website templates, UI
          components, and ready-to-use blocks. Save time and deliver projects
          faster.
        </PageDescription>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg" variant="default">
              Choisir mon mème
            </Button>
          </SheetTrigger>
          <StudioMobileSheet />
        </Sheet>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_public__root/_default/studio/')({
  component: RouteComponent,
  loader: async () => {
    return {
      crumb: 'Studio'
    }
  }
})
