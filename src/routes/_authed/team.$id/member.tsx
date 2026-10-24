import { createFileRoute } from '@tanstack/react-router'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

export const Route = createFileRoute('/_authed/team/$id/member')({
	loader: async () => [
		{
			id: '1',
			user: {
				name: 'John Doe',
				email: 'jhon@mail.com'
			},
			role: 'OWNER'
		},
		{
			id: '2',
			user: {
				name: 'Jane Smith',
				email: 'jane@mail.com'
			},
			role: 'MEMBER'
		}
	],
	// await getMembers({ data: { teamId: params.id } }),
	component: RouteComponent
})

function RouteComponent() {
	const members = Route.useLoaderData()

	return (
		<div>
			<h1 className="mb-10">Members List</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{members.map((member) => (
						<TableRow key={member.id}>
							<TableCell>{member.user.name}</TableCell>
							<TableCell>{member.user.email}</TableCell>
							<TableCell>{member.role}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
