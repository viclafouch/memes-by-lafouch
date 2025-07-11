import React from 'react'
import * as R from 'remeda'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { MEMES_ORDER_BY_OPTIONS, MemesFilters } from '@/constants/meme'
import { useNavigate, useSearch } from '@tanstack/react-router'

const options = [
  { value: 'most_recent', label: ' Plus récents' },
  { value: 'most_old', label: 'Plus anciens' }
] satisfies {
  value: (typeof MEMES_ORDER_BY_OPTIONS)[number]
  label: string
}[]

export const MemesOrderBy = React.memo(() => {
  const navigate = useNavigate()
  const orderBy = useSearch({
    from: '/_auth/library/',
    select: R.prop('orderBy')
  })

  const handleChange = (value: string) => {
    navigate({
      to: '/library',
      search: (prevState) => {
        return {
          page: prevState.page,
          query: prevState.query,
          orderBy: value as MemesFilters['orderBy']
        }
      },
      viewTransition: false,
      replace: true
    })
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
})
