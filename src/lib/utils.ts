import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { AnyFieldApi } from '@tanstack/react-form'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFieldErrorMessage({ field }: { field: AnyFieldApi }) {
  return field.state.meta.isTouched && !field.state.meta.isValid
    ? field.state.meta.errors[0].message
    : ''
}
