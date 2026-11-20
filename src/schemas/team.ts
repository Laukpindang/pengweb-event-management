import { z } from 'zod'

export const CreateTeamSchema = z.object({
	name: z.string().min(1, 'Nama tim wajib diisi').max(100),
	description: z.string().min(3, 'Deskripsi minimal 3 karakter').max(500)
})

export const JoinTeamSchema = z.object({
	teamId: z.string().min(1, 'Team ID wajib diisi')
})
