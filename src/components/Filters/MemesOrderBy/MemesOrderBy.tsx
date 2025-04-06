'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { MemeFiltersOrderBy } from '@/constants/meme'
import { Select, SelectItem } from '@heroui/react'

export type MemesOrderByProps = {
  value: MemeFiltersOrderBy
}

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
      selectionMode="single"
      selectedKeys={[value]}
      onChange={handleChange}
      variant="bordered"
    >
      <SelectItem key="most_recent" value="most_recent">
        Plus récents
      </SelectItem>
      <SelectItem key="most_old" value="most_old">
        Plus anciens
      </SelectItem>
    </Select>
  )
}

export default MemesOrderBy
