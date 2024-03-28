'use client'

import React from 'react'
import { MemeFiltersQuery } from '@/constants/meme'
import { Icon } from '@iconify/react'
import { Input } from '@nextui-org/react'

export type MemesQueryProps = {
  value: MemeFiltersQuery
}

const MemesQuery = ({ value }: MemesQueryProps) => {
  const [searchValue, setSearchValue] = React.useState('')

  console.log(value)

  return (
    <Input
      fullWidth
      aria-label="Search"
      className="w-full"
      labelPlacement="outside"
      placeholder="Rechercher un mème"
      radius="full"
      value={searchValue}
      onChange={(event) => {
        return setSearchValue(event.target.value)
      }}
      startContent={<Icon icon="solar:magnifer-linear" />}
      variant="bordered"
    />
  )
}

export default MemesQuery
