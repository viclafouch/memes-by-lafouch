import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { ProfileContent } from './-components/profile-content'
import { ProfileHeader } from './-components/profile-header'

const RouteComponent = () => {
  const { user, activeSubscription } = useRouteContext({
    from: '/_public__root/_default/settings/'
  })

  return (
    <div className="mx-auto space-y-6 py-10">
      <ProfileHeader user={user} activeSubscription={activeSubscription} />
      <ProfileContent user={user} activeSubscription={activeSubscription} />
    </div>
  )
}

export const Route = createFileRoute('/_public__root/_default/settings/')({
  component: RouteComponent
})
