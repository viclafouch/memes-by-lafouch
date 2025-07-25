import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ZodType } from 'zod'
import type { AnyFieldApi } from '@tanstack/react-form'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFieldErrorMessage({ field }: { field: AnyFieldApi }) {
  return field.state.meta.isTouched && !field.state.meta.isValid
    ? field.state.meta.errors[0].message
    : ''
}

export async function fetchWithZod<T>(
  schema: ZodType<T>,
  ...args: Parameters<typeof fetch>
): Promise<T> {
  const response = await fetch(...args)

  if (!response.ok) {
    try {
      const error = await response.json()

      throw new Error(
        `Fetch failed with status ${response.status}: ${error.message}`
      )
    } catch (error) {
      throw new Error(`Fetch failed with status ${response.status}`)
    }
  }

  const result = await response.json()

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`Response for url : ${response.url}`, result)
  }

  return schema.parse(result, {
    reportInput: process.env.NODE_ENV === 'development'
  })
}
