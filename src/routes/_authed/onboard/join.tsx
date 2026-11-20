import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { ArrowLeftIcon } from 'lucide-react'

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
import { apiClient } from '@/lib/apiClient'
import { JoinTeamSchema } from '@/schemas/team'

export const Route = createFileRoute('/_authed/onboard/join')({
	component: JoinTeam
})

function JoinTeam() {
	const navigate = useNavigate()
	const form = useForm({
		validators: {
			onSubmit: JoinTeamSchema
		},
		defaultValues: {
			teamId: ''
		},
		onSubmit: async ({ value }) => {
			const teamId = value.teamId.trim()
			try {
				await apiClient.post(`/teams/join/${teamId}`)
				toast.add({
					title: 'Sukses',
					description: 'Berhasil bergabung dengan tim!',
					type: 'success'
				})
				navigate({ to: '/team/$id', params: { id: teamId } })
			} catch (error) {
				let message = 'Gagal bergabung dengan tim'
				if (isAxiosError(error) && error.response?.data?.message) {
					message = error.response.data.message
				}
				toast.add({
					title: 'Error',
					description: message,
					type: 'error'
				})
			}
		}
	})

	return (
		<div className="flex flex-col max-w-md mx-auto mt-8 px-4">
			<div className="mb-4">
				<Link
					className={buttonVariants({ variant: 'ghost', size: 'sm' })}
					to="/onboard"
				>
					<ArrowLeftIcon className="w-4 h-4 mr-1" />
					Kembali
				</Link>
			</div>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Gabung ke Tim</CardTitle>
					<CardDescription>
						Masukkan ID Tim yang diberikan oleh pemilik tim.
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
							<form.Field name="teamId">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Team ID</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												placeholder="Contoh: cm3q8..."
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
											className="w-full mt-2"
											disabled={!canSubmit || isSubmitting}
										>
											{isSubmitting ? 'Memproses...' : 'Gabung Tim'}
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
