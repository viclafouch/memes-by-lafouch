import React from 'react'

type PageHeaderProps = {
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
}

export const PageHeader = ({ title, action, description }: PageHeaderProps) => {
  return (
    <div className="flex flex-col items-start md:items-center justify-between md:flex-row gap-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description ? (
          <p className="text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
      <div>{action}</div>
    </div>
  )
}
