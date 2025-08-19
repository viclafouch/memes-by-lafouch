import React from 'react'
import { Badge } from '@/components/ui/badge'
import { getCategoriesListQueryOpts } from '@/lib/queries'
import { toggleValue } from '@/utils/array'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'

export const CategoriesList = () => {
  const categories = useSuspenseQuery(getCategoriesListQueryOpts())
  const activeCategoryIds =
    useSearch({
      strict: false,
      select: (params) => {
        return params.categoryIds
      }
    }) ?? []

  return (
    <div className="w-full overflow-x-auto max-w-full">
      <ul className="flex items-center gap-x-2">
        {categories.data.map((category) => {
          const isActive = activeCategoryIds.includes(category.id)

          return (
            <li key={category.id}>
              <Link
                to="/memes"
                replace
                resetScroll={false}
                aria-current={isActive}
                search={(prevState) => {
                  const categoryIds = toggleValue(
                    category.id,
                    prevState.categoryIds ?? []
                  )

                  return {
                    categoryIds: categoryIds.length ? categoryIds : undefined,
                    page: 1,
                    query: prevState.query,
                    orderBy: prevState.orderBy
                  }
                }}
              >
                <Badge size="lg" variant={isActive ? 'default' : 'outline'}>
                  {category.title}
                </Badge>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
