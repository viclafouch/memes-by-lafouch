import React from 'react'
import { formatDate } from 'date-fns'
import { Pen, Trash } from 'lucide-react'
import { Dialog } from '@/components/animate-ui/radix/dialog'
import { DeleteMemeButton } from '@/components/Meme/delete-meme-button'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { getMemeByIdQueryOpts, getMemesListQueryOpts } from '@/lib/queries'
import { MemeForm } from '@/routes/admin/library/-components/meme-form'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'

const RouteComponent = () => {
  const { memeId } = Route.useParams()
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const memeQuery = useSuspenseQuery(getMemeByIdQueryOpts(memeId))
  const meme = memeQuery.data

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    queryClient.invalidateQueries({
      queryKey: getMemesListQueryOpts.all,
      exact: false
    })
    queryClient.invalidateQueries(getMemeByIdQueryOpts(meme.id))
    router.invalidate()
  }

  return (
    <Container>
      <PageHeader
        title={meme.title}
        description={
          <div className="flex flex-col gap-y-2">
            <span className="text-sm text-gray-500">
              {`${meme.viewCount} vue${meme.viewCount > 1 ? 's' : ''}`} -
              {' Ajouté le '}
              {formatDate(meme.createdAt, 'dd/MM/yyyy')}
            </span>
            <div className="flex flex-wrap gap-1">
              {meme.keywords.map((keyword, index) => {
                return (
                  <Badge variant="outline" key={index}>
                    {keyword}
                  </Badge>
                )
              })}
            </div>
          </div>
        }
        action={
          <>
            <div className="flex gap-2 flex-wrap justify-end">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  return setIsEditDialogOpen(true)
                }}
              >
                <Pen /> Modifier
              </Button>
              <DeleteMemeButton size="sm" meme={meme}>
                <Trash /> Supprimer
              </DeleteMemeButton>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Modifier le mème</DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <MemeForm
                  meme={meme}
                  onSuccess={handleEditSuccess}
                  onCancel={() => {
                    return setIsEditDialogOpen(false)
                  }}
                />
              </DialogContent>
            </Dialog>
          </>
        }
      />
      <div className="py-10">
        <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
          <iframe
            src={`https://iframe.mediadelivery.net/embed/471900/${meme.video.bunnyId}?autoplay=false&loop=false&muted=true&preload=true&responsive=true`}
            title={meme.title}
            className="w-full h-full"
            allow="autoplay; fullscreen"
          />
        </div>
      </div>
    </Container>
  )
}

export const Route = createFileRoute('/admin/library/$memeId')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const meme = await context.queryClient.ensureQueryData(
      getMemeByIdQueryOpts(params.memeId)
    )

    return {
      meme
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
