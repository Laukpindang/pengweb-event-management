import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'

export const Route = createFileRoute('/_authed/team/$id/')({
	// loader: async ({ params }) => {
	// 	const summary = await getTeamSummary(params.id)
	// 	return summary
	// },
	component: RouteComponent
})

interface EventSummary {
	id: string
	name: string
	totalTasks: number
	completionPercentage: number
}

const EventSummaryCard = ({ event }: { event: EventSummary }) => {
	return (
		<div className="px-3 py-2 md:p-4 rounded-lg border shadow-sm">
			<p className="text-sm">{event.name}</p>
			<p className="text-sm text-muted-foreground">
				{event.completionPercentage}% completed ({event.totalTasks} tasks)
			</p>
		</div>
	)
}

interface StatCardProps {
	title: string
	value: number
	color?: React.CSSProperties['color']
}

const StatCard = ({ title, value, color = 'text-primary' }: StatCardProps) => {
	return (
		<div className="px-3 py-2 md:p-4 rounded-lg border shadow-sm">
			<p className="text-sm">{title}</p>
			<p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
		</div>
	)
}

function RouteComponent() {
	// const summary = Route.useLoaderData()
	const params = Route.useParams()

	return (
		<div className="p-6">
			<div className="mb-8 flex justify-between items-end">
				<h1 className="text-2xl md:text-3xl font-bold">
					{/* {summary.teamInfo.name} */}
					Team A
				</h1>
				<p className="font-medium">
					{/* {summary.teamInfo.totalMembers} */}
					10 Team Members
				</p>
			</div>

			<div className="grid grid-cols-1 gap-2 md:grid-cols-4 mb-4">
				<div className="md:text-2xl md:col-span-4 flex justify-between items-center">
					<h2 className="text-xl">Events</h2>
					<Link
						to="/team/$id/event"
						params={{ id: params.id }}
						className={buttonVariants()}
					>
						All Events <ArrowRightIcon />
					</Link>
				</div>
				<EventSummaryCard
					event={{
						id: '1',
						name: 'Event A',
						totalTasks: 10,
						completionPercentage: 50
					}}
				/>
				<EventSummaryCard
					event={{
						id: '2',
						name: 'Event B',
						totalTasks: 15,
						completionPercentage: 75
					}}
				/>
				{/* {summary.eventsSummary.map((event) => (
					<EventSummaryCard key={event.id} event={event} />
				))} */}
			</div>

			<div className="grid grid-cols-1 gap-2 md:grid-cols-4 mb-10">
				<div className="md:text-2xl md:col-span-4 flex justify-between items-center">
					<h2 className="text-xl">Statistics</h2>
					<Button>
						Detail <ArrowRightIcon />
					</Button>
				</div>
				<StatCard
					title="Total Task"
					// value={summary.overallStats.totalInProgress}
					value={20}
				/>
				<StatCard
					title="Unassigned"
					// value={summary.overallStats.totalUnassigned}
					value={5}
				/>
				<StatCard
					title="In Progress"
					// value={summary.overallStats.totalInProgress}
					value={3}
				/>
				<StatCard
					title="Done"
					// value={summary.overallStats.totalDone}
					value={2}
				/>
			</div>
		</div>
	)
}
