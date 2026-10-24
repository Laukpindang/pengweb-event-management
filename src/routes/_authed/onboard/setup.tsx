import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowBigLeft } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

import { CreateTeamSchema } from '@/schemas/team'

export const Route = createFileRoute('/_authed/onboard/setup')({
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
	const navigate = useNavigate()
	const form = useForm({
		validators: {
			onSubmit: CreateTeamSchema
		},
		defaultValues: {
			name: '',
			description: ''
		},
		onSubmit: async () => {
			try {
				// const teamId = await createTeam({ data: value })
				toast.add({
					title: 'Success',
					description: 'Your team have been created.',
					type: 'success'
				})
				navigate({ to: '/team/$id', params: { id: '1' } })
			} catch (error) {
				console.log(error)
			}
		}
	})

	return (
		<div className="flex flex-col max-w-md mx-auto mt-5">
			<div>
				<Link
					className={`mb-5 ${buttonVariants({ variant: 'secondary' })}`}
					to="/onboard"
				>
					<ArrowBigLeft />
					Back
				</Link>
			</div>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Create a team</CardTitle>
					<CardDescription>Start by creating your team.</CardDescription>
				</CardHeader>
				<CardContent>
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
											<FieldLabel htmlFor={field.name}>Team Name</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												placeholder="Awesome Team"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
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
											<FieldLabel htmlFor={field.name}>
												Team Description
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												placeholder="Passionate team"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
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
											{isSubmitting ? 'Creating...' : 'Create'}
										</Button>
									)}
								</form.Subscribe>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
