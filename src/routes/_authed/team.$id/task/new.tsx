import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import axios, { AxiosError } from 'axios'
import { ArrowLeftIcon } from 'lucide-react'
import z from 'zod'
import { Button, buttonVariants } from '@/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

export const Route = createFileRoute('/_authed/team/$id/task/new')({
	component: RouteComponent
})

const CreateTaskSchema = z.object({
	title: z.string().min(5).max(50),
	description: z.string().min(10).max(100),
	due_date: z.iso.date()
})

function RouteComponent() {
	const navigate = useNavigate()
	const form = useForm({
		defaultValues: {
			title: '',
			description: '',
			due_date: ''
		},
		validators: { onSubmit: CreateTaskSchema },
		onSubmit: async ({ value }) => {
			try {
				await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, value)
				toast.add({
					title: 'Success',
					description: 'Task created',
					type: 'success'
				})
				navigate({ to: '..' })
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

	return (
		<div>
			<div className="flex gap-3 mb-10">
				<Link to=".." className={buttonVariants({ variant: 'secondary' })}>
					<ArrowLeftIcon />
				</Link>
				<h1 className="text-2xl">Create a Task</h1>
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
