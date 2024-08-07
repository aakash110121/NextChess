import { z } from 'zod'

export const FormDataSchema = z.object({
  email: z.string().min(7,'Email must contain at least 7 characters').email('Invalid email format'),
  password: z.string().min(5, 'Password must contain at least 5 characters').max(20, 'Max 20 characters'),
})