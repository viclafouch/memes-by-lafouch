import React from 'react'
import { Input } from '@/components/ui/input'

export const MemesQuery = React.memo(
  ({
    query,
    onQueryChange
  }: {
    query: string
    onQueryChange: (query: string) => void
  }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onQueryChange(event.target.value)
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
  }
)
