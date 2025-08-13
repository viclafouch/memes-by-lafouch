import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { MEMES_ORDER_BY_OPTIONS } from '@/constants/meme'

const options = [
  { value: 'most_recent', label: ' Plus récents' },
  { value: 'most_old', label: 'Plus anciens' }
] satisfies {
  value: (typeof MEMES_ORDER_BY_OPTIONS)[number]
  label: string
}[]

export const MemesOrderBy = React.memo(
  ({
    orderBy,
    onOrderByChange
  }: {
    orderBy: (typeof MEMES_ORDER_BY_OPTIONS)[number]
    onOrderByChange: (orderBy: (typeof MEMES_ORDER_BY_OPTIONS)[number]) => void
  }) => {
    const handleChange = (value: string) => {
      onOrderByChange(value as (typeof MEMES_ORDER_BY_OPTIONS)[number])
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Ordonner</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36">
          <DropdownMenuRadioGroup value={orderBy} onValueChange={handleChange}>
            {options.map((option) => {
              return (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              )
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
