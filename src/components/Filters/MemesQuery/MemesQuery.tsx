'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '@nextui-org/react'
import { MagnifyingGlass } from '@phosphor-icons/react'

const MemesQuery = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = event.target.value

      const params = new URLSearchParams(searchParams)

      if (newQuery) {
        params.set('query', newQuery)
      } else {
        params.delete('query')
      }

      router.replace(`${pathname}?${params.toString()}`)
    },
    300
  )

  return (
    <Input
      fullWidth
      aria-label="Search"
      className="w-full"
      labelPlacement="outside"
      placeholder="Rechercher un mème"
      radius="full"
      size="lg"
      defaultValue={searchParams.get('query')?.toString()}
      onChange={handleChange}
      startContent={<MagnifyingGlass size={16} />}
      variant="bordered"
    />
  )
}

export default MemesQuery
