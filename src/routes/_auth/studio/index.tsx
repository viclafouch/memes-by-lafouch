import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <div>
      <div>Selectionner un meme</div>
    </div>
  )
}

export const Route = createFileRoute('/_auth/studio/')({
  component: RouteComponent
})
