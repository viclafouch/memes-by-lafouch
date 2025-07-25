import { DownloadFromTwitterForm } from '@/components/download-from-twitter-form'
import { PageHeader } from '@/components/page-header'
import { Container } from '@/components/ui/container'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <Container>
      <PageHeader title="Téléchargeur" />
      <div className="py-10">
        <DownloadFromTwitterForm />
      </div>
    </Container>
  )
}

export const Route = createFileRoute('/_auth/downloader')({
  component: RouteComponent,
  loader: async () => {
    return {
      crumb: 'Téléchargeur'
    }
  }
})
