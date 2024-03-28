'use client'

import { OurFileRouter } from '@/app/api/uploadthing/core'
import { generateUploadDropzone } from '@uploadthing/react'

export const UploadDropzoneGenerated = generateUploadDropzone<OurFileRouter>()

const UploadDropzone = () => {
  return (
    <UploadDropzoneGenerated
      endpoint="videoUploader"
      onClientUploadComplete={(response) => {
        // Do something with the response
        console.log('Files: ', response)
        alert('Upload Completed')
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`)
      }}
      onUploadBegin={(name) => {
        // Do something once upload begins
        console.log('Uploading: ', name)
      }}
    />
  )
}

export default UploadDropzone
