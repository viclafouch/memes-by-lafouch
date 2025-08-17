import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { CategoryForm } from '@/routes/admin/categories/-components/category-form'
import { useRouter } from '@tanstack/react-router'

export const AddCategoryButton = ({
  ...restButtonProps
}: Partial<React.ComponentProps<typeof Button>>) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    setIsOpen(false)
    router.invalidate()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...restButtonProps} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une catégorie</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <CategoryForm type="add" onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
