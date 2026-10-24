import { useForm } from '@tanstack/react-form'

import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/_authed/team/$id/event/new')({
	component: RouteComponent
})

function RouteComponent() {
	const params = Route.useParams()
	const form = useForm({
		defaultValues: {},
		onSubmit: ({ value }) => {
			console.log({ ...value, params })
		}
	})

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					form.handleSubmit()
				}}
			>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="name">Name</Label>
						<Input id="name" placeholder="Event name" />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="description">Description</Label>
						<Input id="description" placeholder="Event description" />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="start_time">Start Time</Label>
						<Input id="start_time" type="datetime-local" />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="end_time">End Time</Label>
						<Input id="end_time" type="datetime-local" />
					</div>
					<Button type="submit">Create Event</Button>
				</div>
			</form>
		</div>
	)
}
