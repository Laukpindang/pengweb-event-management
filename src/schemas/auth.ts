import { z } from 'zod'

export const SignInSchema = z.object({
	email: z.string().email('Format email tidak valid'),
	password: z.string().min(8, 'Password minimal 8 karakter')
})

export const SignUpSchema = z.object({
	name: z.string().min(3, 'Nama minimal 3 karakter'),
	email: z.string().email('Format email tidak valid'),
	password: z.string().min(8, 'Password minimal 8 karakter')
})
