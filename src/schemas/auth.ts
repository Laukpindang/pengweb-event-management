import z from 'zod'

export const SignInSchema = z.object({
	email: z.email(),
	password: z.string().min(8)
})

export const SignUpSchema = SignInSchema.extend({
	name: z.string().min(3)
})
