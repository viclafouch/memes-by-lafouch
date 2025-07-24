import React from 'react'
import { Search } from 'lucide-react'
import { MemeListItem } from '@/components/Meme/meme-list-item'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/spinner'
import { getBestMemesQueryOpts } from '@/lib/queries'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const [searchSubmitted, setSearchSubmitted] = React.useState('')

  const bestMemesQuery = useQuery({
    ...getBestMemesQueryOpts(searchSubmitted),
    enabled: searchSubmitted.trim().length > 0
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = new FormData(event.currentTarget)

    setSearchSubmitted(form.get('query')?.toString() || '')
  }

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="400"
        className="absolute w-screen h-screen inset-0 -z-10"
      >
        <defs>
          <linearGradient
            id="gradient"
            x1="0.854"
            y1="0.854"
            x2="0.146"
            y2="0.146"
          >
            <stop offset="0.000" stopColor="rgb(7, 10, 11)" />
            <stop offset="0.500" stopColor="rgb(0, 0, 0)" />
            <stop offset="1.000" stopColor="rgb(3, 27, 53)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#gradient)" />
      </svg>
      <div className="mx-auto flex w-full flex-col gap-4 pt-32 lg:pt-48 px-6">
        <div>
          <h1 className="font-heading text-pretty text-center font-semibold tracking-tighter text-gray-100 sm:text-[32px] md:text-[46px] text-[29px] mb-4">
            Quel mème voulez-vous ?
          </h1>
          <div className="max-w-6xl mx-auto flex flex-col gap-y-16 w-full">
            <div className="content-center relative mx-auto w-full max-w-196">
              <div className="relative z-10 flex w-full flex-col">
                <form
                  className="focus-within:border-gray-300 p-3 z-10 relative rounded-xl border border-gray-600 transition-all overflow-visible flex"
                  onSubmit={handleSubmit}
                >
                  <input
                    className="w-full border-0 outline-0 grow"
                    placeholder="Demandez-moi un mème…"
                    name="query"
                    type="text"
                    required
                  />
                  <Button size="sm" variant="secondary" className="shrink-0">
                    <Search />
                  </Button>
                </form>
              </div>
              <div className="mt-4 flex gap-2">
                <h4 className="text-gray-300 text-sm">
                  Quelques exemples de mots clefs pour vous aider :
                </h4>
                <div className="flex gap-2">
                  {[
                    'travailler dur',
                    'cuisiner',
                    'pleurer',
                    'faire du sport',
                    'pleurer de rire'
                  ].map((keyword) => {
                    return (
                      <Badge key={keyword} variant="outline">
                        {keyword}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bestMemesQuery.isLoading ? <LoadingSpinner /> : null}
              {bestMemesQuery.data?.map((meme) => {
                return <MemeListItem key={meme.id} meme={meme} />
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/ask-me')({
  component: RouteComponent
})
