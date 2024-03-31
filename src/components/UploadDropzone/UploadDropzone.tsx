'use client'

import React from 'react'
import { filesize } from 'filesize'
import { getFileExtension } from '@/utils/file'
import { Button } from '@nextui-org/react'

export type UploadDropzoneProps = {
  inputProps?: React.ComponentProps<'input'>
  isInvalid?: boolean
  errorMessage?: string
}

const UploadDropzone = ({
  inputProps = undefined,
  errorMessage = '',
  isInvalid = false
}: UploadDropzoneProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [file, setFile] = React.useState<File | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [newFile] = Array.from(event.target.files ?? [])

    if (!newFile) {
      return
    }

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
    <div>
      <label className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center cursor-pointer has-[input[aria-invalid=true]]:border-red-600 has-[input[aria-invalid=true]]:bg-danger-50">
        <input
          onChange={handleChange}
          type="file"
          ref={inputRef}
          className="hidden"
          aria-invalid={isInvalid}
          {...inputProps}
        />
        {file ? (
          <div>
            <video
              className="mx-auto max-w-full max-h-96"
              src={URL.createObjectURL(file)}
              controls
            />
            <div>
              <p className="text-center mt-2 font-mono text-gray-600">
                {filesize(file.size, { standard: 'jedec' })} -{' '}
                {getFileExtension(file).toUpperCase()}
              </p>
              <div className="flex mt-4 justify-center">
                <Button size="sm" onClick={handleRemove}>
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Button isDisabled color="primary" className="opacity-1">
              Ajouter 1 fichier vidéo
            </Button>
            <span className="text-small text-gray-400 mt-3">16MB Max</span>
          </>
        )}
      </label>
      {errorMessage ? (
        <div className="text-tiny text-danger p-1 relative flex-col gap-1.5">
          {errorMessage}
        </div>
      ) : null}
    </div>
  )
}

export default UploadDropzone
