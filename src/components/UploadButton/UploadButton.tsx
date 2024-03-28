'use client'

import React from 'react'
import { OurFileRouter } from '@/app/api/uploadthing/core'
import { generateUploadButton } from '@uploadthing/react'

export const UploadButtonGenerated = generateUploadButton<OurFileRouter>()

const UploadButton = () => {
  return (
    <UploadButtonGenerated
      endpoint="videoUploader"
      onClientUploadComplete={(response) => {
        // Do something with the response
        console.log('Files: ', response)
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        console.log(error)
      }}
    />
  )
}

export default UploadButton
