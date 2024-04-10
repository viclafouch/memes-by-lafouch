'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '@nextui-org/react'
import { MagnifyingGlass } from '@phosphor-icons/react'

export type MemesQueryProps = {
  value: string
}

const MemesQuery = ({ value }: MemesQueryProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()
  const [liveValue, setLiveValue] = React.useState(value)

  const debounced = useDebouncedCallback(
    (queryDebounced: string) => {
      const params = new URLSearchParams(searchParams)

      if (queryDebounced) {
        params.set('query', queryDebounced)
      } else {
        params.delete('query')
      }

      params.delete('page')
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    },
    500,
    // The maximum time func is allowed to be delayed before it's invoked:
    { maxWait: 2000 }
  )

  React.useEffect(() => {
    setLiveValue(value)
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLiveValue = event.target.value
    setLiveValue(newLiveValue)

    if (!isPending) {
      debounced(newLiveValue)
    }
  }

  return (
    <Input
      fullWidth
      aria-label="Rechercher"
      className="w-full"
      labelPlacement="outside"
      placeholder="Rechercher un mème"
      radius="full"
      size="lg"
      value={liveValue}
      onChange={handleChange}
      startContent={<MagnifyingGlass size={16} />}
      variant="bordered"
    />
  )
}

export default MemesQuery
