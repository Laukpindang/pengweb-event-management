import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import axios, { AxiosError } from 'axios'

import { ArrowLeftIcon, TrashIcon } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

import { EditTaskSchema } from '@/schemas/tasks'

import type { Task } from '@/types/task'

export const Route = createFileRoute('/_authed/team/$id/task/$taskId/edit')({
	component: RouteComponent,
	loader: async ({ params }) => {
		const { data } = await axios.get<Task>(
			`${import.meta.env.VITE_API_URL}/tasks/${params.taskId}`
		)
		return data
	}
})

function RouteComponent() {
	const navigate = useNavigate()
	const initialValue = Route.useLoaderData()

	const { taskId, id } = Route.useParams()

	const form = useForm({
		defaultValues: {
			title: initialValue.title,
			description: initialValue.description,
			due_date: initialValue.due_date
		},
		validators: { onSubmit: EditTaskSchema },
		onSubmit: async ({ value }) => {
			try {
				await axios.patch(
					`${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
					value
				)
				toast.add({
					title: 'Success',
					description: 'Task edited',
					type: 'success'
				})
				navigate({ to: '/team/$id/task', params: { id } })
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.add({
						title: 'Error',
						description: error.message,
						type: 'error'
					})
				} else {
					toast.add({
						title: 'Error',
						description: 'Something when wrong',
						type: 'error'
					})
				}
			}
		}
	})

	const deleteTask = async () => {
		try {
			await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`)
			toast.add({
				title: 'Success',
				description: 'Task deleted',
				type: 'success'
			})
			navigate({ to: '/team/$id/task', params: { id } })
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.add({
					title: 'Error',
					description: error.message,
					type: 'error'
				})
			} else {
				toast.add({
					title: 'Error',
					description: 'Something when wrong',
					type: 'error'
				})
			}
		}
	}

	return (
		<div>
			<div className="flex gap-3 mb-10">
				<Link
					to="/team/$id/task"
					params={{ id }}
					className={buttonVariants({ variant: 'secondary' })}
				>
					<ArrowLeftIcon />
				</Link>
				<h1 className="text-2xl grow">Edit Task</h1>
				<Button onClick={deleteTask}>
					Delete <TrashIcon />
				</Button>
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					form.handleSubmit()
				}}
			>
				<FieldGroup>
					<form.Field name="title">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Title</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										aria-invalid={isInvalid}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
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
									<FieldLabel htmlFor={field.name}>Description</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										aria-invalid={isInvalid}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							)
						}}
					</form.Field>
					<form.Field name="due_date">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Description</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										aria-invalid={isInvalid}
										type="date"
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							)
						}}
					</form.Field>
					<Field>
						<form.Subscribe
							selector={(state) => ({
								isSubmitting: state.isSubmitting,
								canSubmit: state.canSubmit
							})}
						>
							{({ isSubmitting, canSubmit }) => (
								<Button
									type="submit"
									disabled={!canSubmit || isSubmitting}
									aria-disabled={!canSubmit || isSubmitting}
								>
									{isSubmitting ? 'Loading...' : 'Create task'}
								</Button>
							)}
						</form.Subscribe>
					</Field>
				</FieldGroup>
			</form>
		</div>
	)
}
