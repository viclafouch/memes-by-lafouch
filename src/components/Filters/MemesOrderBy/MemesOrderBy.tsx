'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { MemeFiltersOrderBy } from '@/constants/meme'
import { Select, SelectItem } from '@nextui-org/react'

export type MemesOrderByProps = {
  value: MemeFiltersOrderBy
}

const MemesOrderBy = ({ value }: MemesOrderByProps) => {
  const router = useRouter()
  const [optimisticValue, setOptimisticValue] = React.useOptimistic(value)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as MemeFiltersOrderBy

    if (!newValue) {
      return
    }

    const newParams = new URLSearchParams({ orderBy: newValue })

    React.startTransition(() => {
      setOptimisticValue(newValue)

      router.push(`?${newParams}`)
    })
  }

  return (
    <Select
      aria-label="Trier par"
      className="w-40"
      radius="full"
      selectionMode="single"
      selectedKeys={[optimisticValue]}
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
