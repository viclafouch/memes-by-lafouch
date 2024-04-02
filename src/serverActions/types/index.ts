import { z } from 'zod'

export type SimpleFormState<S, T extends z.Schema> =
  | {
      errorMessage: string
      status: 'error'
      formErrors: z.typeToFlattenedError<z.infer<T>> | null
    }
  | ({
      status: 'success'
    } & S)
  | {
      status: 'idle'
    }
