import React from 'react'
import { toast } from 'sonner'
import ConfirmAlert from '@/components/confirm-alert'
import { Button } from '@/components/ui/button'
import { deleteMemeById } from '@/server/meme'
import type { Meme } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

type DeleteMemeButtonProps = {
  meme: Meme
} & React.ComponentProps<typeof Button>

export const DeleteMemeButton = ({
  meme,
  ...restButtonProps
}: DeleteMemeButtonProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationKey: ['delete-meme'],
    mutationFn: async (body: { id: string }) => {
      const promise = deleteMemeById({ data: body.id })
      toast.promise(promise, {
        loading: 'Suppression...',
        success: () => {
          return 'Mème supprimé avec succès !'
        }
      })

      return promise
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['memes-list'],
        exact: false
      })
      navigate({ to: '/library' })
    }
  })

  const handleConfirm = () => {
    if (deleteMutation.isPending) {
      return
    }

    deleteMutation.mutate({ id: meme.id })
  }

  return (
    <ConfirmAlert
      title="Supprimer le mème"
      description="Êtes-vous sûr de vouloir supprimer ce mème ?"
      confirmText="Supprimer"
      onConfirm={handleConfirm}
      trigger={
        <Button
          disabled={deleteMutation.isPending}
          type="button"
          variant="destructive"
          {...restButtonProps}
        />
      }
    />
  )
}
