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
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

import { SignInSchema } from '@/schemas/auth'

export const Route = createFileRoute('/auth/sign-in')({
	validateSearch: (search: Record<string, unknown>) => ({
		redirect: typeof search.redirect === 'string' ? search.redirect : undefined
	}),
	beforeLoad: async ({ context }) => {
		const session = await context.auth.ensureSession()

		if (session) {
			const hasTeam = await context.auth.checkHasTeam()
			if (hasTeam.hasTeam) {
				throw redirect({ to: '/team/$id', params: { id: hasTeam.teamId } })
			}
			throw redirect({ to: '/onboard' })
		}
	},
	component: Login
})

function Login() {
	const ctx = Route.useRouteContext()
	const search = Route.useSearch()

	const navigate = useNavigate()
	const form = useForm({
		validators: {
			onSubmit: SignInSchema
		},
		defaultValues: {
			email: '',
			password: ''
		},
		onSubmit: async ({ value }) => {
			try {
				await ctx.auth.login(value.email, value.password)
				toast.add({
					title: 'Success',
					description: 'Login berhasil',
					type: 'success'
				})
				if (
					search.redirect &&
					search.redirect !== '/' &&
					!search.redirect.includes('/auth/')
				) {
					window.location.href = search.redirect
					return
				}

				const hasTeam = await ctx.auth.checkHasTeam()

				if (hasTeam.hasTeam) {
					navigate({ to: '/team/$id', params: { id: hasTeam.teamId } })
					return
				}
				navigate({ to: '/onboard' })
			} catch (error) {
				toast.add({
					title: 'Gagal',
					description: String(error),
					type: 'error'
				})
			}
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
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
