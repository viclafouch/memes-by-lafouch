import React from 'react'
import { StudioFavorites } from '@/components/studio/studio-favorites'
import { StudioMemes } from '@/components/studio/studio-memes'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const StudioTabs = () => {
  const [columnGridCount, setColumnGridCount] = React.useState<number>(3)

  return (
    <Tabs defaultValue="all-memes" className="h-full">
      <TabsList className="w-full">
        <TabsTrigger value="all-memes">Tous les Memes</TabsTrigger>
        <TabsTrigger value="favorites-memes">Mes favoris</TabsTrigger>
      </TabsList>
      <TabsContent value="all-memes" className="h-full">
        <StudioMemes
          columnGridCount={columnGridCount}
          onColumnValueChange={setColumnGridCount}
        />
      </TabsContent>
      <TabsContent value="favorites-memes">
        <StudioFavorites />
      </TabsContent>
    </Tabs>
  )
}
