import { useForm } from '@tanstack/react-form'
import {
	createFileRoute
	// Link
} from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
// import { buttonVariants } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

export const Route = createFileRoute('/_authed/team/$id/event/')({
	component: RouteComponent
})

type Event = {
	id: string
	name: string
	description: string
	start_time: Date
	end_time: Date
}

function RouteComponent() {
	const [events, setEvents] = useState<Event[]>([])
	// const params = Route.useParams()

	const form = useForm({
		defaultValues: {
			name: '',
			description: '',
			start_time: '',
			end_time: ''
		},
		onSubmit: ({ value }) => {
			setEvents((prev) => [
				...prev,
				{
					id: new Date().toISOString(),
					name: value.name,
					description: value.description,
					start_time: new Date(value.start_time),
					end_time: new Date(value.end_time)
				}
			])
		}
	})

	return (
		<div>
			<div className="flex items-center justify-between mb-5 md:mb-10">
				<h1>All Events</h1>
				<Popover>
					<PopoverTrigger
						render={
							<Button>
								New Event <PlusIcon />
							</Button>
						}
					/>
					<PopoverContent>
						<form
							onSubmit={(e) => {
								e.preventDefault()
								form.handleSubmit()
							}}
						>
							<FieldGroup>
								<form.Field name="name">
									{(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel>Name</FieldLabel>
												<Input
													id={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													autoComplete="off"
												/>
											</Field>
										)
									}}
								</form.Field>
								<form.Field name="description">
									{(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel>Description</FieldLabel>
												<Input
													id={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													autoComplete="off"
												/>
											</Field>
										)
									}}
								</form.Field>
								<form.Field name="start_time">
									{(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel>Start Time</FieldLabel>
												<Input
													id={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													autoComplete="off"
													type="date"
												/>
											</Field>
										)
									}}
								</form.Field>
								<form.Field name="end_time">
									{(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel>End Time</FieldLabel>
												<Input
													id={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													aria-invalid={isInvalid}
													autoComplete="off"
													type="date"
												/>
											</Field>
										)
									}}
								</form.Field>
								<Button type="submit">Create Event</Button>
							</FieldGroup>
						</form>
					</PopoverContent>
				</Popover>
				{/* <Link
					to="/team/$id/event/new"
					params={{ id: params.id }}
					className={buttonVariants()}
				>
					New Event <PlusIcon />
				</Link> */}
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
					{events.length > 0 ? (
						events.map((event) => (
							<TableRow key={event.id}>
								<TableCell>{event.name}</TableCell>
								<TableCell>{event.description}</TableCell>
								<TableCell>{event.start_time.toDateString()}</TableCell>
								<TableCell>{event.end_time.toDateString()}</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={4} className="text-center py-10">
								No Event Yet...
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}
