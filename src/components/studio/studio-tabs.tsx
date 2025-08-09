import React from 'react'
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@/components/animate-ui/headless/tabs'
import { StudioMemes } from '@/components/studio/studio-memes'

export const StudioTabs = () => {
  return (
    <TabGroup>
      <TabList className="w-full">
        <Tab index={0}>Memes</Tab>
        <Tab index={1}>Outils</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <StudioMemes />
        </TabPanel>
        <TabPanel>Tab 3 Content</TabPanel>
      </TabPanels>
    </TabGroup>
  )
}
