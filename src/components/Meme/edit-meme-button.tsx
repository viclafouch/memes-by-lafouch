import React from 'react'
import { Edit, ImageUp, X } from 'lucide-react'
import { toast } from 'sonner'
import type { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingButton } from '@/components/ui/loading-button'
import { VideoFrameExtractorDialog } from '@/components/video-frame-extractor-dialog'
import type { MemeWithVideo } from '@/constants/meme'
import { getFieldErrorMessage } from '@/lib/utils'
import { EDIT_MEME_SCHEMA, editMeme } from '@/server/meme'
import type { Meme } from '@prisma/client'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type EditMemeButtonProps = {
  meme: MemeWithVideo
} & Partial<React.ComponentProps<typeof Button>>

export const EditMemeButton = ({
  meme,
  ...restButtonProps
}: EditMemeButtonProps) => {
  const queryClient = useQueryClient()
  const [isExtractorOpened, setIsExtractorOpened] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [keywordValue, setKeywordValue] = React.useState<string>('')

  const openExtrator = () => {
    setIsExtractorOpened(true)
  }

  const closeExtrator = () => {
    setIsExtractorOpened(false)
  }

  const editMutation = useMutation({
    mutationKey: ['edit-meme'],
    mutationFn: async (
      body: z.infer<typeof EDIT_MEME_SCHEMA> & { memeId: Meme['id'] }
    ) => {
      const promise = editMeme({ data: body })
      toast.promise(promise, {
        loading: 'Modification...',
        success: () => {
          return 'Mème modifié avec succès !'
        }
      })

      setIsOpen(false)

      return promise
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memes-list'], exact: false })
    }
  })

  const form = useForm({
    defaultValues: {
      keywords: meme.keywords,
      tweetUrl: meme.tweetUrl,
      title: meme.title,
      poster: meme.video.poster
    },
    validators: {
      onChange: EDIT_MEME_SCHEMA
    },
    onSubmit: async ({ value }) => {
      if (editMutation.isPending) {
        return
      }

      await editMutation.mutateAsync({
        title: value.title,
        keywords: value.keywords,
        poster: value.poster,
        tweetUrl: value.tweetUrl,
        memeId: meme.id
      })
    }
  })

  const handleAddKeyword = () => {
    if (keywordValue.trim()) {
      form.setFieldValue('keywords', (prevState) => {
        return [
          ...new Set([
            ...prevState,
            ...keywordValue
              .split(',')
              .map((keyword) => {
                return keyword.trim().toLowerCase()
              })
              .filter((word) => {
                return Boolean(word.trim())
              })
          ])
        ]
      })
    }

    setKeywordValue('')
  }

  const handleRemoveKeyword = (keywordIndex: number) => {
    form.setFieldValue('keywords', (prevState) => {
      return prevState.filter((_, index) => {
        return index !== keywordIndex
      })
    })
  }

  const handleExtractFrame = (frame: string) => {
    form.setFieldValue('poster', frame)
    closeExtrator()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button {...restButtonProps} />
        </DialogTrigger>
        <DialogContent aria-describedby="toto">
          <DialogHeader>
            <DialogTitle>Modifier le mème</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form
            id="edit-meme-form"
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              handleAddKeyword()
              form.handleSubmit()
            }}
          >
            <div className="flex flex-col gap-y-6">
              <form.Field
                name="title"
                children={(field) => {
                  const errorMessage = getFieldErrorMessage({ field })

                  return (
                    <FormItem error={errorMessage}>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="text"
                          id="title"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            return field.handleChange(event.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <form.Field
                name="keywords"
                children={(field) => {
                  const errorMessage = getFieldErrorMessage({ field })

                  return (
                    <FormItem error={errorMessage}>
                      <FormLabel>
                        Mots clés ({field.state.value.length})
                      </FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="text"
                          id="keywords"
                          name={field.name}
                          onBlur={field.handleBlur}
                          value={keywordValue}
                          onChange={(event) => {
                            setKeywordValue(event.target.value)
                          }}
                          enterKeyHint="done"
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              event.stopPropagation()
                              handleAddKeyword()
                            }
                          }}
                        />
                      </FormControl>
                      {field.state.value.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {field.state.value.map((keyword, index) => {
                            return (
                              <Badge variant="secondary" key={keyword}>
                                {keyword}
                                <button
                                  onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    handleRemoveKeyword(index)
                                  }}
                                  aria-label="Supprimer"
                                  type="button"
                                  className="hover:bg-muted flex items-center p-0 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            )
                          })}
                        </div>
                      ) : null}
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <form.Field
                name="tweetUrl"
                children={(field) => {
                  const errorMessage = getFieldErrorMessage({ field })

                  return (
                    <FormItem error={errorMessage}>
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="text"
                          id="tweet-url"
                          name={field.name}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            return field.handleChange(event.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <div>
                <form.Field
                  name="poster"
                  children={(field) => {
                    const errorMessage = getFieldErrorMessage({ field })

                    return (
                      <FormItem error={errorMessage}>
                        <Label>Miniature</Label>
                        {field.state.value ? (
                          <div className="overflow-hidden relative group w-fit">
                            <img
                              src={field.state.value}
                              className="rounded-sm w-50 max-w-full h-auto border-input border"
                              alt="Miniature"
                              loading="lazy"
                            />
                            <div className="flex items-center justify-center scale-0 group-hover:scale-100 transition-transform absolute top-1/2 left-1/2 -translate-1/2">
                              <Button
                                size="icon"
                                variant="secondary"
                                type="button"
                                onClick={openExtrator}
                              >
                                <Edit />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={openExtrator}
                            type="button"
                          >
                            Ajouter une miniature <ImageUp />
                          </Button>
                        )}
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>
            </div>
          </form>
          <form.Subscribe
            selector={(state) => {
              return [state.canSubmit, state.isSubmitting]
            }}
            children={([canSubmit, isSubmitting]) => {
              return (
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Annuler
                    </Button>
                  </DialogClose>
                  <LoadingButton
                    type="submit"
                    form="edit-meme-form"
                    isLoading={isSubmitting}
                    disabled={!canSubmit}
                  >
                    Enregistrer
                  </LoadingButton>
                </DialogFooter>
              )
            }}
          />
        </DialogContent>
      </Dialog>
      <VideoFrameExtractorDialog
        isOpen={isExtractorOpened}
        videoSrc={meme.video.src}
        onExtractFrame={handleExtractFrame}
        onOpenChange={setIsExtractorOpened}
      />
    </>
  )
}
