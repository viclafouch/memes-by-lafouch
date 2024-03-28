import React from 'react'
import UploadDropzone from '@/components/UploadDropzone'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const Page = async () => {
  await prisma.post.create({
    data: {
      title: 'Learn Next.js'
    }
  })

  console.log('test')

  return (
    <div className="md:container md:mx-auto flex flex-col gap-4 items-center justify-center py-32">
      <h1 className="text-4xl">Ajouter une video à la bibliothèque</h1>
      <UploadDropzone />
    </div>
  )
}

export default Page
