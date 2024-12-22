'use client'

import React from 'react'
import FormCreateMeme from '@/components/FormCreateMeme'
import FormTwitterLink from '@/components/FormTwitterLink'
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react'
import { FileVideo, TwitterLogo } from '@phosphor-icons/react'

export type FormsTabsProps = never

const FormsTabs = () => {
  return (
    <div className="flex flex-col w-full items-center">
      <Card className="max-w-full w-[600px] min-h-[400px]">
        <CardBody className="overflow-hidden">
          <Tabs fullWidth aria-label="Tabs form" size="lg">
            <Tab
              key="file"
              title={
                <div className="flex items-center space-x-2">
                  <FileVideo />
                  <span>Fichier local</span>
                </div>
              }
            >
              <FormCreateMeme />
            </Tab>
            <Tab
              key="twitter"
              title={
                <div className="flex items-center space-x-2">
                  <TwitterLogo />
                  <span>Vidéo Twitter</span>
                </div>
              }
            >
              <FormTwitterLink />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  )
}

export default FormsTabs
