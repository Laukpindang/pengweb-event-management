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
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { apiClient } from '@/lib/apiClient'
import { CreateEventSchema } from '@/schemas/event'

export const Route = createFileRoute('/_authed/team/$id/event/new')({
	component: CreateEventPage
})

function CreateEventPage() {
	const { id } = Route.useParams()
	const navigate = useNavigate()

	const form = useForm({
		validators: {
			onSubmit: CreateEventSchema
		},
		defaultValues: {
			name: '',
			description: '',
			startTime: '',
			endTime: ''
		},
		onSubmit: async ({ value }) => {
			try {
				await apiClient.post(`/teams/${id}/events`, {
					name: value.name.trim(),
					description: value.description.trim(),
					startTime: new Date(value.startTime).toISOString(),
					endTime: new Date(value.endTime).toISOString()
				})
				toast.add({
					title: 'Sukses',
					description: 'Event berhasil dibuat!',
					type: 'success'
				})
				navigate({ to: '/team/$id/event', params: { id } })
			} catch (error) {
				let message = 'Gagal membuat event'
				if (isAxiosError(error) && error.response?.data?.message) {
					const msg = error.response.data.message
					message = Array.isArray(msg) ? msg.join(', ') : msg
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
		<div className="max-w-xl mx-auto space-y-4">
			<div>
				<Link
					to="/team/$id/event"
					params={{ id }}
					className={buttonVariants({ variant: 'ghost', size: 'sm' })}
				>
					<ArrowLeftIcon className="w-4 h-4 mr-1" />
					Kembali ke Daftar Event
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Buat Event Baru</CardTitle>
					<CardDescription>
						Tentukan judul, deskripsi, dan rentang waktu pelaksanaan event atau
						milestone kegiatan.
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
											<FieldLabel htmlFor={field.name}>Nama Event</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												placeholder="Contoh: Sprint 1 Planning"
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
												Deskripsi Event
											</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												placeholder="Deskripsikan agenda, target, atau rincian kegiatan..."
												rows={3}
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							</form.Field>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<form.Field name="startTime">
									{(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>
													Waktu Mulai
												</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													type="datetime-local"
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													aria-invalid={isInvalid}
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										)
									}}
								</form.Field>

								<form.Field name="endTime">
									{(field) => {
										const isInvalid =
											field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>
													Waktu Selesai
												</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													type="datetime-local"
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													aria-invalid={isInvalid}
												/>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
											</Field>
										)
									}}
								</form.Field>
							</div>

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
											className="w-full mt-4"
											disabled={!canSubmit || isSubmitting}
										>
											{isSubmitting ? 'Menyimpan...' : 'Simpan Event'}
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
