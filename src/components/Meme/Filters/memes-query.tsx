import React from 'react'
import * as R from 'remeda'
import { Input } from '@/components/ui/input'
import { useNavigate, useSearch } from '@tanstack/react-router'

export const MemesQuery = React.memo(() => {
  const navigate = useNavigate()
  const query = useSearch({
    from: '/_auth/library/',
    select: R.prop('query')
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    navigate({
      to: '/library',
      search: (prevState) => {
        return {
          page: 1,
          query: event.target.value,
          orderBy: prevState.orderBy
        }
      },
      viewTransition: false,
      replace: true
    })
  }

  return (
    <div className="flex w-full max-w-xs items-center gap-2">
      <Input
        value={query}
        onChange={handleChange}
        type="search"
        placeholder="Rechercher"
      />
    </div>
  )
})
