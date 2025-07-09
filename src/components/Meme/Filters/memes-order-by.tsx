import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { MEMES_ORDER_BY_OPTIONS, MemesFilters } from '@/constants/meme'

export type MemesOrderByProps = {
  orderBy: MemesFilters['orderBy']
  onChange: (orderBy: MemesFilters['orderBy']) => void
}

const options = [
  { value: 'most_recent', label: ' Plus récents' },
  { value: 'most_old', label: 'Plus anciens' }
] satisfies {
  value: (typeof MEMES_ORDER_BY_OPTIONS)[number]
  label: string
}[]

export const MemesOrderBy = ({ orderBy, onChange }: MemesOrderByProps) => {
  const handleChange = (value: string) => {
    onChange(value as MemesFilters['orderBy'])
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
