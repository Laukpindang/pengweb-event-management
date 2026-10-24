import z from 'zod'

export const CreateTeamSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().min(10).max(500)
})

export const JoinTeamSchema = z.object({
	teamId: z.string().min(1, 'Team ID is required')
})
