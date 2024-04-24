import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import FormTwitterLink from '@/components/FormTwitterLink'
import { XLogo } from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'Viclafouch - Ajouter un mème via X'
}

const Page = () => {
  return (
    <Container className="py-32" id="homepage">
      <div className="flex flex-col justify-center gap-8">
        <h1 className="text-black text-4xl text-center text-balance">
          Ajouter un mème via <span className="sr-only">x</span>
          <span className="inline-flex align-middle bg-black px-2 rounded-lg">
            <XLogo className="inline text-white w-[36px] h-[36px] md:w-[54px] md:h-[54px]" />
          </span>
        </h1>
        <div className="w-full max-w-screen-sm mx-auto">
          <FormTwitterLink />
          <div className="text-center">
            <Link href="/new" className="text-white underline">
              Uploader un fichier local ?
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Page
