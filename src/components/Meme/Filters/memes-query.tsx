import React from 'react'
import { Input } from '@/components/ui/input'
import type { MemesFilters } from '@/constants/meme'

type MemesQueryProps = {
  query: MemesFilters['query']
  onChange: (query: MemesFilters['query']) => void
}

export const MemesQuery = ({ query = '', onChange }: MemesQueryProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    onChange(event.target.value)
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
