import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	beforeLoad: async ({ context }) => {
		const session = await context.auth.ensureSession()

		if (session) {
			const hasTeam = await context.auth.checkHasTeam()
			if (hasTeam.hasTeam)
				throw redirect({ to: '/team/$id', params: { id: hasTeam.teamId } })
			throw redirect({ to: '/onboard' })
		}
		throw redirect({ to: '/auth/sign-in', search: { redirect: '/' } })
	}
})
