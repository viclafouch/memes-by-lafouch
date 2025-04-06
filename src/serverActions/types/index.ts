import type { z } from 'zod'

export type SimpleFormState<TSuccess, T extends z.Schema> =
  | {
      errorMessage: string
      status: 'error'
      formErrors: z.typeToFlattenedError<z.infer<T>> | null
    }
  | ({
      status: 'success'
    } & TSuccess)
  | {
      status: 'idle'
    }
