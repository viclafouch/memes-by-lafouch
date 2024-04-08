'use client'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useSnackbar } from 'notistack'
import { MemeWithVideo } from '@/constants/meme'
import { useFormStateCallback } from '@/hooks/useFormStateCallback'
import { updateMeme, UpdateMemeFormState } from '@/serverActions/updateMeme'
import { Button, ButtonProps, Chip, Input, Link } from '@nextui-org/react'

export type FormUpdateMemeProps = {
  meme: MemeWithVideo
}

const SubmitButton = ({ ...restButtonProps }: ButtonProps) => {
  const status = useFormStatus()

  return (
    <Button
      isLoading={status.pending}
      type="submit"
      size="lg"
      color="primary"
      className="w-full"
      {...restButtonProps}
    >
      Enregistrer
    </Button>
  )
}

const initialState: UpdateMemeFormState = {
  status: 'idle'
}

const FormUpdateMeme = ({ meme }: FormUpdateMemeProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const [keywordValue, setKeywordValue] = React.useState<string>('')
  const [keywords, setKeywords] = React.useState(meme.keywords)

  const [formState, formAction] = useFormState(updateMeme, initialState)

  useFormStateCallback(formState, {
    isError: (values) => {
      return values.status === 'error' && values.errorMessage ? values : false
    },
    isSuccess: (values) => {
      return values.status === 'success' ? values : false
    },
    onError: (values) => {
      enqueueSnackbar({
        message: values.errorMessage,
        variant: 'error'
      })
    },
    onSuccess: () => {
      enqueueSnackbar({
        message: 'Mème mis à jour avec succès !',
        variant: 'success'
      })
    }
  })

  const handleRemoveKeyword = (keywordIndex: number) => {
    setKeywords((prevState) => {
      return prevState.filter((_, index) => {
        return index !== keywordIndex
      })
    })
  }

  const handleAddKeyword = () => {
    setKeywordValue('')

    if (keywordValue.trim()) {
      setKeywords((prevState) => {
        return [...prevState, keywordValue]
      })
    }
  }

  const handleAction = (formData: FormData) => {
    for (const keyword of keywords) {
      formData.append('keywords', keyword)
    }

    return formAction(formData)
  }

  const formErrors = formState.status === 'error' ? formState.formErrors : null

  return (
    <form action={handleAction} className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-col gap-6">
        <input type="hidden" name="id" value={meme.id} />
        <Input
          isRequired
          label="Titre"
          name="title"
          placeholder=" "
          defaultValue={meme.title}
          isInvalid={Boolean(formErrors?.fieldErrors.title?.[0])}
          errorMessage={formErrors?.fieldErrors.title?.[0]}
          labelPlacement="outside"
        />
        <div className="flex flex-col has-[.chip]:gap-3">
          <Input
            label={`Mots clés (${keywords.length})`}
            isClearable
            onClear={() => {
              setKeywordValue('')
            }}
            value={keywordValue}
            placeholder=" "
            onChange={(event) => {
              setKeywordValue(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleAddKeyword()
              }
            }}
            labelPlacement="outside"
          />
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => {
              return (
                <Chip
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${keyword}-${index}`}
                  variant="bordered"
                  className="chip"
                  onClose={() => {
                    return handleRemoveKeyword(index)
                  }}
                >
                  {keyword}
                </Chip>
              )
            })}
          </div>
        </div>
        <Input
          label="Twitter URL"
          name="tweetUrl"
          isClearable
          placeholder=" "
          defaultValue={meme.tweetUrl || ''}
          isInvalid={Boolean(formErrors?.fieldErrors.tweet?.[0])}
          errorMessage={formErrors?.fieldErrors.tweet?.[0]}
          labelPlacement="outside"
        />
        <div className="w-full flex gap-6">
          <Input
            isDisabled
            label="Clef vidéo (uploadThing)"
            defaultValue={meme.video.videoUtKey}
            labelPlacement="outside"
            description={
              <Link
                className="text-xs pointer-events-auto"
                href={meme.video.src}
                target="_blank"
              >
                Accéder au fichier
              </Link>
            }
          />
          <Input
            isDisabled
            label="Clef poster (uploadThing)"
            defaultValue={meme.video.posterUtKey || ''}
            labelPlacement="outside"
            description={
              meme.video.poster ? (
                <Link
                  className="text-xs pointer-events-auto"
                  href={meme.video.poster}
                  target="_blank"
                >
                  Accéder au fichier
                </Link>
              ) : null
            }
          />
        </div>
      </div>
      <div className="w-full">
        <SubmitButton />
      </div>
    </form>
  )
}

export default FormUpdateMeme
