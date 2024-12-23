import { createFileRoute } from '@tanstack/react-router'

const Home = () => {
  Route.useLoaderData()

  return (
    <div className="p-2">
      <button className="btn">Button</button>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home
})
