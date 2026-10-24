import { createFileRoute, Link } from '@tanstack/react-router'

import { buttonVariants } from '@/components/ui/button'

export const Route = createFileRoute('/_authed/onboard/')({
	// beforeLoad: async () => {
	// 	const session = await getSession()

	// 	if (!session) {
	// 		throw redirect({
	// 			to: '/auth/sign-in'
	// 		})
	// 	}
	// },
	component: CreateTeam
})

function CreateTeam() {
	return (
		<div className="border p-8 mt-10 rounded-2xl bg-accent">
			<h1 className="mb-4">Choose your option to start a team</h1>
			<div className="flex justify-between items-baseline">
				<Link to="/onboard/setup" className={buttonVariants()}>
					Create a team
				</Link>
				<Link to="/onboard/join" className={buttonVariants()}>
					Join by Id
				</Link>
			</div>
		</div>
	)
}
