import { useForm } from '@tanstack/react-form'
import {
	createFileRoute,
	Link,
	redirect,
	useNavigate
} from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { SignUpSchema } from '@/schemas/auth'

export const Route = createFileRoute('/auth/sign-up')({
	beforeLoad: async () => {
		const session = false

		if (session) {
			// check if user has a team
			const hasTeam = { hasTeam: true, teamId: '1' }
			if (hasTeam.hasTeam) {
				throw redirect({ to: '/team/$id', params: { id: hasTeam.teamId } })
			}
			throw redirect({ to: '/onboard' })
		}
	},
	component: Register
})

function Register() {
	const navigate = useNavigate()
	const form = useForm({
		validators: {
			onSubmit: SignUpSchema
		},
		defaultValues: {
			name: '',
			email: '',
			password: ''
		},
		onSubmit: async () => {
			// hit api here to create user
			// const res = await authClient.signUp.email(value)
			// if (res.error) {
			// 	toast.add({
			// 		title: 'Error',
			// 		description: res.error.message,
			// 		type: 'error'
			// 	})
			// 	return
			// }
			toast.add({
				title: 'Success',
				description: 'Your account have been created.',
				type: 'success'
			})
			navigate({ to: '/onboard' })
		}
	})

	return (
		<div className="flex flex-col max-w-md mx-auto mt-10">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome</CardTitle>
					<CardDescription>
						We will not share your personal data
					</CardDescription>
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
											<FieldLabel htmlFor={field.name}>Name</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												placeholder="Jhon Doe"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							</form.Field>
							<form.Field name="email">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												type="email"
												placeholder="m@example.com"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							</form.Field>
							<form.Field name="password">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Password</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												type="password"
												placeholder="••••••••"
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
											{isSubmitting ? 'Loading...' : 'Sign Up'}
										</Button>
									)}
								</form.Subscribe>
								<FieldDescription className="text-center">
									Have an account? <Link to="/auth/sign-in">Sign in</Link>
								</FieldDescription>
							</Field>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								Or continue with
							</FieldSeparator>
							<Field>
								<Button variant="outline" type="button">
									Login with Apple
								</Button>
								<Button variant="outline" type="button">
									Login with Google
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
