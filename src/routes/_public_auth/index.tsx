import React from 'react'
import { ChevronRight, Search } from 'lucide-react'
import { MemesList } from '@/components/Meme/memes-list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getBestMemes } from '@/server/ai'
import { createFileRoute, Link } from '@tanstack/react-router'

const RouteComponent = () => {
  const { memes } = Route.useLoaderData()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    console.log('submitted')
  }

  return (
    <div className="relative min-h-screen pb-20">
      <div className="mx-auto flex w-full flex-col gap-4 pt-32 lg:pt-48 px-6">
        <div>
          <h1 className="font-heading text-pretty text-center font-semibold tracking-tighter text-gray-100 sm:text-[32px] md:text-[46px] text-[29px] mb-4">
            Quel mème voulez-vous ?
          </h1>
          <div className="max-w-6xl mx-auto flex flex-col gap-y-40 w-full">
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
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="text-left text-base font-medium">
                    Uploadé par les utilisateurs
                  </div>
                  <Link
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-100 focus:text-gray-100"
                    to="/library"
                  >
                    <span>Tout parcourir</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
                <p className="text-sm text-gray-500">
                  Explore what the community is building with v0.
                </p>
              </div>
              <section className="flex flex-col items-center gap-y-12">
                <MemesList layoutContext="index" memes={memes} />
                <Button asChild variant="outline" size="lg">
                  <Link to="/library">Voir tous les mèmes</Link>
                </Button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_public_auth/')({
  component: RouteComponent,
  loader: async () => {
    const memes = await getBestMemes()

    return {
      memes: memes.map((meme) => {
        return {
          ...meme,
          isBookmarked: false
        }
      })
    }
  }
})
