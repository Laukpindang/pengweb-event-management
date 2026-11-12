import { createFileRoute, Link } from '@tanstack/react-router'
import axios from 'axios'
import { PencilIcon, PlusIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import type { Task } from '@/types/task'

export const Route = createFileRoute('/_authed/team/$id/task/')({
	component: RouteComponent,
	loader: async () => {
		const { data } = await axios.get<Task[]>(
			`${import.meta.env.VITE_API_URL}/tasks`
		)
		return data
	}
})

function RouteComponent() {
	const { id } = Route.useParams()
	const tasks = Route.useLoaderData()

	return (
		<div>
			<div className="flex items-center justify-between mb-10">
				<h1>All Tasks</h1>
				<Link
					to="/team/$id/task/new"
					params={{ id }}
					className={buttonVariants()}
				>
					Create new
					<PlusIcon />
				</Link>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Due Date</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tasks.map((task) => (
						<TableRow key={task.id}>
							<TableCell>{task.title}</TableCell>
							<TableCell>{task.description}</TableCell>
							<TableCell>{new Date(task.due_date).toDateString()}</TableCell>
							<TableCell>{task.status}</TableCell>
							<TableCell>
								<Link
									to="/team/$id/task/$taskId/edit"
									params={{ id, taskId: task.id }}
									className={buttonVariants()}
								>
									Edit <PencilIcon />
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
