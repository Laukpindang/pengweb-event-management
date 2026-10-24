import { createFileRoute } from '@tanstack/react-router'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

export const Route = createFileRoute('/_authed/team/$id/my-task')({
	loader: async () => [
		{
			id: '1',
			title: 'Task 1',
			description: 'Description 1',
			due_date: new Date(),
			status: 'Pending'
		},
		{
			id: '2',
			title: 'Task 2',
			description: 'Description 2',
			due_date: new Date(),
			status: 'In Progress'
		}
	],
	component: RouteComponent
})

function RouteComponent() {
	const tasks = Route.useLoaderData()

	return (
		<div>
			<h1 className="mb-10">Your Tasks</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Due Date</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tasks.map((task) => (
						<TableRow key={task.id}>
							<TableCell>{task.title}</TableCell>
							<TableCell>{task.description}</TableCell>
							<TableCell>{task.due_date.toDateString()}</TableCell>
							<TableCell>{task.status}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
