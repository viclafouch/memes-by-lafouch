'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { MemeFiltersOrderBy } from '@/constants/meme'
import { Select, SelectItem } from '@heroui/react'

export type MemesOrderByProps = {
  value: MemeFiltersOrderBy
}

export const options = [
  { key: 'most_recent', label: ' Plus récents' },
  { key: 'most_old', label: 'Plus anciens' }
]

const MemesOrderBy = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as MemeFiltersOrderBy

    if (!newValue) {
      return
    }

    const params = new URLSearchParams(searchParams)
    params.set('orderBy', newValue)

    router.replace(`${pathname}?${params.toString()}`)
  }

  const value = searchParams.get('orderBy') ?? 'most_recent'

  return (
    <Select
      aria-label="Trier par"
      className="w-full"
      radius="full"
      items={options}
      selectionMode="single"
      selectedKeys={[value]}
      onChange={handleChange}
      variant="bordered"
    >
      {(option) => {
        return <SelectItem>{option.label}</SelectItem>
      }}
    </Select>
  )
}

export default MemesOrderBy
