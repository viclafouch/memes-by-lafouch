import React from 'react'
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger
} from '@/components/animate-ui/radix/tabs'
import { StudioFavorites } from '@/components/studio/studio-favorites'
import { StudioMemes } from '@/components/studio/studio-memes'

export const StudioTabs = () => {
  return (
    <Tabs defaultValue="tab1">
      <TabsList className="w-full">
        <TabsTrigger value="tab1">Tous les Memes</TabsTrigger>
        <TabsTrigger value="tab2">Mes favoris</TabsTrigger>
      </TabsList>
      <TabsContents>
        <TabsContent value="tab1">
          <StudioMemes />
        </TabsContent>
        <TabsContent value="tab2">
          <StudioFavorites />
        </TabsContent>
      </TabsContents>
    </Tabs>
  )
}
