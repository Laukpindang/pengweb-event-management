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
import { SignInSchema } from '@/schemas/auth'

export const Route = createFileRoute('/auth/sign-in')({
	beforeLoad: async () => {
		// check session from server here
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
	component: Login
})

function Login() {
	const navigate = useNavigate()
	const form = useForm({
		validators: {
			onSubmit: SignInSchema
		},
		defaultValues: {
			email: '',
			password: ''
		},
		onSubmit: async () => {
			// hit api here to sign in user
			// const res = await authClient.signIn.email(value)
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
				description: 'You have been logged in.',
				type: 'success'
			})
			const hasTeam = { hasTeam: true, teamId: '1' }
			if (hasTeam.hasTeam) {
				navigate({ to: '/team/$id', params: { id: hasTeam.teamId } })
				return
			}
			navigate({ to: '/onboard' })
		}
	})

	return (
		<div className="flex flex-col max-w-md mx-auto mt-10">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>
						Enter your email and password to sign in to your account
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
											{isSubmitting ? 'Loading...' : 'Sign in'}
										</Button>
									)}
								</form.Subscribe>
								<FieldDescription className="text-center">
									Don&apos;t have an account?{' '}
									<Link to="/auth/sign-up">Sign up</Link>
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
