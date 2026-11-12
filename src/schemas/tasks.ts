import z from 'zod'

export const CreateTaskSchema = z.object({
	title: z.string().min(5).max(50),
	description: z.string().min(10).max(100),
	due_date: z.iso.date()
})

export const EditTaskSchema = CreateTaskSchema
