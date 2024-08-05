'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useIntersectionObserver } from 'usehooks-ts'
import { Input } from '@nextui-org/react'
import { MagnifyingGlass } from '@phosphor-icons/react'

export type MemesQueryProps = {
  value: string
}

const MemesQuery = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = React.useState<string>('')
  const { ref } = useIntersectionObserver({
    rootMargin: '-64px 0px 0px 0px',
    onChange: (isIntersecting: boolean, entry) => {
      const inputElement = entry.target as HTMLInputElement

      if (!isIntersecting && document.activeElement === inputElement) {
        inputElement.blur()
      }
    }
  })

  React.useEffect(() => {
    setSearchValue(searchParams.get('query') ?? '')
  }, [searchParams, setSearchValue])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const newSearchValue = formData.get('search') ?? ''
    const newParams = new URLSearchParams(searchParams.toString())

    if (newSearchValue) {
      newParams.set('query', newSearchValue.toString())
    } else {
      newParams.delete('query')
    }

    newParams.delete('page')

    router.replace(`/library/?${newParams.toString()}`)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        fullWidth
        aria-label="Rechercher"
        className="w-full"
        labelPlacement="outside"
        placeholder="Rechercher un mème"
        radius="full"
        ref={ref}
        autoComplete="off"
        size="lg"
        name="search"
        value={searchValue}
        onChange={handleChange}
        endContent={<MagnifyingGlass size={16} />}
        variant="bordered"
      />
    </form>
  )
}

export default MemesQuery
