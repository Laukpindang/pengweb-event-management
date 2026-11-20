import { z } from 'zod'

export const CreateEventSchema = z
	.object({
		name: z.string().min(1, 'Nama event wajib diisi').max(100),
		description: z.string().min(1, 'Deskripsi event wajib diisi').max(500),
		startTime: z.string().min(1, 'Waktu mulai wajib diisi'),
		endTime: z.string().min(1, 'Waktu selesai wajib diisi')
	})
	.refine(
		(data) => {
			if (!data.startTime || !data.endTime) return true
			return new Date(data.endTime) > new Date(data.startTime)
		},
		{
			message: 'Waktu selesai harus setelah waktu mulai',
			path: ['endTime']
		}
	)
