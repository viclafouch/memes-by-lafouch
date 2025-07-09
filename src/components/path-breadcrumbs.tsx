import React from 'react'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { isMatch, Link, useMatches } from '@tanstack/react-router'

export const PathBreadcrumbs = () => {
  const matches = useMatches()

  // Don't render if any match is still pending
  if (
    matches.some((match) => {
      return match.status === 'pending'
    })
  ) {
    return null
  }

  // Filter matches that have breadcrumb data
  const matchesWithCrumbs = matches.filter((match) => {
    return isMatch(match, 'loaderData.crumb')
  })

  // Don't render breadcrumbs if no matches have crumb data
  if (matchesWithCrumbs.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/library">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {matchesWithCrumbs.map((match, index) => {
          const isLast = index === matchesWithCrumbs.length - 1

          return (
            <React.Fragment key={match.fullPath}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{match.loaderData?.crumb}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link from={match.fullPath}>{match.loaderData?.crumb}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
