import React from 'react'
import { Badge } from '@/components/ui/badge'
import { getCategoriesListQueryOpts } from '@/lib/queries'
import { toggleValue } from '@/utils/array'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'

export const CategoriesList = () => {
  const categories = useSuspenseQuery(getCategoriesListQueryOpts())

  const activeCategorySlugs =
    useSearch({
      strict: false,
      select: (params) => {
        return params.categories
      }
    }) ?? []

  return (
    <div className="w-full overflow-x-auto max-w-full">
      <ul className="flex items-center gap-x-2">
        {categories.data.map((category) => {
          const isActive = activeCategorySlugs.includes(category.slug)

          return (
            <li key={category.id}>
              <Link
                to="/memes"
                replace
                resetScroll={false}
                aria-current={isActive}
                search={(prevState) => {
                  const categorySlugs = toggleValue(
                    category.slug,
                    prevState.categories ?? []
                  )

                  return {
                    categories: categorySlugs.length
                      ? categorySlugs
                      : undefined,
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
