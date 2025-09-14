import React from 'react'
import { buttonVariants } from '@/components/ui/button'
import { getCategoriesListQueryOpts } from '@/lib/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'

export const CategoriesList = () => {
  const categories = useSuspenseQuery(getCategoriesListQueryOpts())

  const activeCategorySlug = useSearch({
    strict: false,
    select: (params) => {
      return params.category
    }
  })

  return (
    <div className="w-full overflow-x-auto max-w-full no-scrollbar py-2">
      <ul className="flex items-center gap-x-2">
        {categories.data.map((category) => {
          const isActive = activeCategorySlug === category.slug

          return (
            <li key={category.id} className="shrink-0">
              <Link
                to="/memes"
                replace
                resetScroll={false}
                aria-current={isActive}
                search={(prevState) => {
                  return {
                    category: isActive ? undefined : category.slug,
                    page: 1,
                    query: prevState.query
                  }
                }}
                className={buttonVariants({
                  variant: isActive ? 'default' : 'outline',
                  size: 'sm'
                })}
              >
                {category.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
