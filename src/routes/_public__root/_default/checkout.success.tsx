import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  return <div>Hello checkout success</div>
}

export const Route = createFileRoute(
  '/_public__root/_default/checkout/success'
)({
  component: RouteComponent
})
