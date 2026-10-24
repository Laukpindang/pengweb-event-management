import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	beforeLoad: async () => {
		// get session from server here
		const session = true

		if (session) {
			// check if user has team
			const hasTeam = { hasTeam: true, teamId: '1' }
			if (hasTeam.hasTeam)
				throw redirect({ to: '/team/$id', params: { id: hasTeam.teamId } })
			throw redirect({ to: '/onboard' })
		}
		throw redirect({ to: '/auth/sign-in' })
	}
})
