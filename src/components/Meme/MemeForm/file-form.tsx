import React from 'react'
import { Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger
} from '@/components/ui/file-upload'
import { FormItem, FormMessage } from '@/components/ui/form'
import { getFieldErrorMessage } from '@/lib/utils'
import { createMemeFromFile } from '@/server/meme'
import { formOptions, useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'

const formSchema = z.object({
  file: z.instanceof(File, {
    message: "Le fichier vidéo n'est pas valide"
  })
})

type FileFormProps = {
  onSuccess?: () => void
  closeDialog: () => void
}

const formOpts = formOptions({
  defaultValues: {
    // See https://github.com/TanStack/form/issues/1583#issuecomment-2980179941
    file: undefined as unknown as File
  },
  validators: {
    onChange: formSchema
  }
})

export const FileForm = ({ onSuccess, closeDialog }: FileFormProps) => {
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      if (createMemeFromFileMutation.isPending) {
        return
      }

      await createMemeFromFileMutation.mutateAsync({ file: value.file })
    }
  })

  const createMemeFromFileMutation = useMutation({
    mutationKey: ['createMemeFromFile'],
    mutationFn: (body: { file: File }) => {
      const formData = new FormData()
      formData.append('file', body.file)

      const promise = createMemeFromFile({ data: formData })
      toast.promise(promise, {
        loading: 'Ajout en cours...',
        success: () => {
          return 'Mème créé avec succès !'
        },
        error: 'Une erreur est survenue'
      })
      closeDialog()

      return promise
    },
    onSuccess: () => {
      onSuccess?.()
    }
  })

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`
    })
  }, [])

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
      noValidate
      className="flex flex-col gap-4"
    >
      <form.Field
        name="file"
        children={(field) => {
          const errorMessage = getFieldErrorMessage({ field })

          return (
            <FormItem error={errorMessage} className="w-full">
              <FileUpload
                value={field.state.value ? [field.state.value] : []}
                onValueChange={(files) => {
                  return field.handleChange(files[0])
                }}
                onFileReject={onFileReject}
                accept="video/*"
                maxFiles={1}
                className="w-full"
              >
                <FileUploadDropzone>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                      <Upload className="size-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">
                      Glisser-déposer ton fichier ici
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Ou cliquez pour parcourir (1 fichier maximum)
                    </p>
                  </div>
                  <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                      Parcourir les fichiers
                    </Button>
                  </FileUploadTrigger>
                </FileUploadDropzone>
                <FileUploadList>
                  {field.state.value ? (
                    <FileUploadItem value={field.state.value}>
                      <FileUploadItemPreview />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <X />
                        </Button>
                      </FileUploadItemDelete>
                    </FileUploadItem>
                  ) : null}
                </FileUploadList>
              </FileUpload>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <form.Subscribe
        selector={(state) => {
          return [state.canSubmit, state.isSubmitting]
        }}
        children={([canSubmit, isSubmitting]) => {
          return (
            <div className="w-full flex justify-end gap-x-2">
              <Button onClick={closeDialog} variant="outline" type="button">
                Annuler
              </Button>
              <Button
                variant="default"
                disabled={!canSubmit || isSubmitting}
                type="submit"
              >
                Ajouter
              </Button>
            </div>
          )
        }}
      />
    </form>
  )
}
