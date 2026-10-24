import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
	// beforeLoad: async () => {
	// 	// check session from server here
	// 	const session = { user: { id: '1', name: 'John Doe' } }

	// 	if (!session) {
	// 		throw redirect({
	// 			to: '/auth/sign-in'
	// 		})
	// 	}

	// 	return { user: session.user }
	// },
	component: () => <Outlet />
})
