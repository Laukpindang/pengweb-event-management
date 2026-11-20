import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
	beforeLoad: async ({ context, location }) => {
		const hasSession = await context.auth.ensureSession()

		if (!hasSession) {
			throw redirect({
				to: '/auth/sign-in',
				search: {
					redirect: location.href
				}
			})
		}
	},
	component: () => <Outlet />
})
