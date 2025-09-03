import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { MemeStatus } from '@/constants/meme'
import { MemeStatusFixed } from '@/constants/meme'

export const MemesFilterStatus = React.memo(
  ({
    status,
    onStatusChange
  }: {
    status: MemeStatus
    onStatusChange: (status: MemeStatus) => void
  }) => {
    const handleChange = (value: string) => {
      onStatusChange(value as MemeStatus)
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Filtrer par statut</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36">
          <DropdownMenuRadioGroup value={status} onValueChange={handleChange}>
            <DropdownMenuRadioItem
              value={MemeStatusFixed.PUBLISHED}
              key="published"
            >
              Publiés
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={MemeStatusFixed.PENDING}>
              En attente
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={MemeStatusFixed.REJECTED}>
              Rejetés
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={MemeStatusFixed.ARCHIVED}>
              Archivés
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
