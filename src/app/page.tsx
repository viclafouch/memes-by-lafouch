import React from 'react'
import UploadDropzone from '@/components/UploadDropzone'
import prisma from '@/db'
import { Button, Input } from '@nextui-org/react'

const Page = () => {
  async function create(formData: FormData) {
    'use server'

    await prisma.meme.create({
      data: {
        title: formData.get('meme_title') as string,
        videoUrl:
          'https://utfs.io/f/5c0af5ce-9632-4dd0-9282-59235dd8aabf-z3zuq.com_vickymykh_616207.mp4'
      }
    })
  }

  return (
    <div className="md:container md:mx-auto flex flex-col gap-4 items-center justify-center py-32">
      <h1 className="text-4xl">Ajouter une video à la bibliothèque</h1>
      <UploadDropzone />
      <form action={create}>
        <Input label="titre" name="meme_title" />
        <Button type="submit">Créer un fake meme</Button>
      </form>
    </div>
  )
}

export default Page
