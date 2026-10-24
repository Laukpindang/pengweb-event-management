import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
// import { getEvents } from '@/server/event'

export const Route = createFileRoute('/_authed/team/$id/event/')({
	loader: async () => [
		{
			id: '1',
			name: 'Event 1',
			description: 'Description 1',
			start_time: new Date(),
			end_time: new Date()
		},
		{
			id: '2',
			name: 'Event 2',
			description: 'Description 2',
			start_time: new Date(),
			end_time: new Date()
		}
	], // await getEvents({ data: { teamId: params.id } }),
	// await getEvents({ data: { teamId: params.id } }),
	component: RouteComponent
})

function RouteComponent() {
	const events = Route.useLoaderData()
	const params = Route.useParams()

	return (
		<div>
			<div className="flex items-center justify-between mb-5 md:mb-10">
				<h1>All Events</h1>
				<Link
					to="/team/$id/event/new"
					params={{ id: params.id }}
					className={buttonVariants()}
				>
					New Event <PlusIcon />
				</Link>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Start Date</TableHead>
						<TableHead>End Date</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{events.map((event) => (
						<TableRow key={event.id}>
							<TableCell>{event.name}</TableCell>
							<TableCell>{event.description}</TableCell>
							<TableCell>{event.start_time.toDateString()}</TableCell>
							<TableCell>{event.end_time.toDateString()}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
