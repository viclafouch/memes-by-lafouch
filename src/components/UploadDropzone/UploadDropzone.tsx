'use client'

import React from 'react'
import { filesize } from 'filesize'
import { getFileExtension } from '@/utils/file'
import { Button, Input } from '@nextui-org/react'

export type UploadDropzoneProps = {
  isInvalid?: boolean
  errorMessage?: string
}

const UploadDropzone = ({
  errorMessage = '',
  isInvalid = false
}: UploadDropzoneProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [file, setFile] = React.useState<File | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [newFile] = Array.from(event.target.files ?? [])

    setFile(newFile)
  }

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    setFile(null)
  }

  return (
    <div className="w-full flex flex-col gap-y-2">
      <Input
        onChange={handleChange}
        type="file"
        isRequired
        ref={inputRef}
        aria-invalid={isInvalid}
        errorMessage={errorMessage}
        name="video"
        accept="video/*"
        className="w-full"
        variant="bordered"
      />
      {file ? (
        <div className="w-full h-auto flex flex-col border-medium rounded-medium border-default-200">
          <video
            className="w-full max-w-full max-h-96 aspect-video"
            src={URL.createObjectURL(file)}
            controls
          />
          <div className="p-3 flex justify-end items-center gap-x-4">
            <p className="text-center text-small text-gray-600">
              {filesize(file.size, { standard: 'jedec' })} -{' '}
              {getFileExtension(file).toUpperCase()}
            </p>
            {/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
            <Button size="sm" onClick={handleRemove}>
              Supprimer
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default UploadDropzone
