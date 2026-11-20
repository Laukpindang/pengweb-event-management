import { z } from 'zod'

export const CreateTaskSchema = z.object({
	title: z
		.string()
		.min(5, 'Judul minimal 5 karakter')
		.max(50, 'Judul maksimal 50 karakter'),
	description: z
		.string()
		.min(10, 'Deskripsi minimal 10 karakter')
		.max(100, 'Deskripsi maksimal 100 karakter'),
	dueDate: z.string().min(1, 'Batas waktu wajib diisi'),
	eventId: z.string().min(1, 'Event wajib dipilih'),
	assigneeId: z.string().optional()
})

export const UpdateTaskSchema = z.object({
	status: z.enum(['UNASSIGNED', 'IN_PROGRESS', 'COMPLETED']),
	assigneeId: z.string().optional()
})

export const EditTaskSchema = UpdateTaskSchema
