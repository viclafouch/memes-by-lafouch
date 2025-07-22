import { Pen, Share, Trash } from 'lucide-react'
import { DeleteMemeButton } from '@/components/Meme/delete-meme-button'
import { EditMemeButton } from '@/components/Meme/edit-meme-button'
import { ShareMemeButton } from '@/components/Meme/share-meme-button'
import { PageHeader } from '@/components/page-header'
import { Container } from '@/components/ui/container'
import { cloudinaryClient } from '@/lib/cloudinary-client'
import { getMemeByIdQueryOpts } from '@/lib/queries'
import { Delivery } from '@cloudinary/url-gen/actions'
import { Format } from '@cloudinary/url-gen/qualifiers'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { memeId } = Route.useParams()
  const memeQuery = useSuspenseQuery(getMemeByIdQueryOpts(memeId))
  const meme = memeQuery.data

  const video = cloudinaryClient.video(meme.video.cloudinaryId)

  const thumbnailUrl = cloudinaryClient
    .video(meme.video.cloudinaryId)
    .addTransformation(`so_1s`)
    .delivery(Delivery.format(Format.avif()))
    .toURL()

  return (
    <Container>
      <PageHeader
        title={meme.title}
        description={
          <>
            {meme.downloadCount} téléchargement
            {meme.downloadCount > 1 ? 's' : ''}{' '}
          </>
        }
        action={
          <div className="flex gap-2 flex-wrap justify-end">
            <ShareMemeButton size="sm" variant="secondary" meme={meme}>
              <Share /> Partager
            </ShareMemeButton>
            <EditMemeButton size="sm" variant="secondary" meme={meme}>
              <Pen /> Modifier
            </EditMemeButton>
            <DeleteMemeButton size="sm" meme={meme}>
              <Trash /> Supprimer
            </DeleteMemeButton>
          </div>
        }
      />
      <div className="py-10">
        <div className="relative w-full overflow-hidden lg:rounded-medium shadow-small flex flex-col gap-6">
          {/* Top Shadow */}
          <div className="hidden lg:block lg:absolute top-0 z-10 lg:h-32 w-full rounded-medium bg-gradient-to-b from-black/80 to-transparent" />
          <video
            src={video.toURL()}
            controls
            poster={thumbnailUrl}
            className="w-full aspect-video"
          />
        </div>
      </div>
    </Container>
  )
}

export const Route = createFileRoute('/_auth/library/$memeId')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const meme = await context.queryClient.ensureQueryData(
      getMemeByIdQueryOpts(params.memeId)
    )

    return {
      meme,
      crumb: meme.title
    }
  },
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          name: 'description',
          content: 'My App is a web application'
        },
        {
          title: loaderData?.meme.title
        }
      ]
    }
  }
})
