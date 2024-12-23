import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return <div>Hello "/_public/pricing"!</div>
}

export const Route = createFileRoute('/_public/pricing')({
  component: RouteComponent
})
