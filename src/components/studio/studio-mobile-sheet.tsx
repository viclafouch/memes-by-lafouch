import React from 'react'
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/animate-ui/radix/sheet'
import { StudioTabs } from '@/components/studio/studio-tabs'

export const StudioMobileSheet = () => {
  return (
    <SheetContent side="right" className="flex flex-col sm:max-w-xl">
      <SheetHeader className="shrink-0">
        <SheetTitle>Choisir un mème</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </SheetDescription>
      </SheetHeader>
      <div className="h-full flex-1 overflow-hidden">
        <StudioTabs />
      </div>
    </SheetContent>
  )
}
