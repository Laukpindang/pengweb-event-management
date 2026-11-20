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
import { CreateTaskSchema } from '@/schemas/tasks'
import type { Event } from '@/types'

export const Route = createFileRoute(
	'/_authed/team/$id/event/$eventId/task/new'
)({
	loader: async ({ params }) => {
		try {
			const { data: events } = await apiClient.get<Event[]>(
				`/teams/${params.id}/events`
			)
			return { events: events || [] }
		} catch (err) {
			console.error('Failed to load events for task creation:', err)
			return { events: [] }
		}
	},
	component: CreateTaskPage
})

function CreateTaskPage() {
	const { events } = Route.useLoaderData()
	const { id, eventId } = Route.useParams()
	const navigate = useNavigate()

	const defaultEventId = events.length > 0 ? events[0].id : ''

	const form = useForm({
		validators: {
			onSubmit: CreateTaskSchema
		},
		defaultValues: {
			title: '',
			description: '',
			dueDate: '',
			eventId: defaultEventId
		},
		onSubmit: async ({ value }) => {
			try {
				await apiClient.post('/tasks', {
					title: value.title.trim(),
					description: value.description.trim(),
					dueDate: new Date(value.dueDate).toISOString(),
					eventId: value.eventId
				})
				toast.add({
					title: 'Sukses',
					description: 'Tugas berhasil dibuat!',
					type: 'success'
				})
				navigate({
					to: '/team/$id/event/$eventId/task',
					params: { id, eventId }
				})
			} catch (error) {
				let message = 'Gagal membuat tugas'
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

	if (events.length === 0) {
		return (
			<div className="max-w-md mx-auto mt-12 text-center space-y-4">
				<Card className="p-8">
					<CardTitle className="text-xl">Event Belum Dibuat</CardTitle>
					<CardDescription className="mt-2 mb-6">
						Setiap tugas harus terhubung ke dalam suatu event. Silakan buat
						event terlebih dahulu sebelum menambahkan tugas baru.
					</CardDescription>
					<div className="flex justify-center gap-3">
						<Link
							to="/team/$id/event/$eventId/task"
							params={{ id, eventId }}
							className={buttonVariants({ variant: 'outline' })}
						>
							Kembali
						</Link>
						<Link
							to="/team/$id/event/new"
							params={{ id }}
							className={buttonVariants({ variant: 'default' })}
						>
							Buat Event Sekarang
						</Link>
					</div>
				</Card>
			</div>
		)
	}

	return (
		<div className="max-w-xl mx-auto space-y-4">
			<div>
				<Link
					to="/team/$id/event/$eventId/task"
					params={{ id, eventId }}
					className={buttonVariants({ variant: 'ghost', size: 'sm' })}
				>
					<ArrowLeftIcon className="w-4 h-4 mr-1" />
					Kembali ke Daftar Tugas
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Buat Tugas Baru</CardTitle>
					<CardDescription>
						Tambahkan tugas baru untuk anggota tim dalam event yang dipilih.
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
							<form.Field name="title">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												Judul Tugas (5-50 karakter)
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												placeholder="Contoh: Desain landing page mockup"
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
												Deskripsi (10-100 karakter)
											</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												placeholder="Jelaskan kebutuhan dan detail pengerjaan tugas ini..."
												rows={3}
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							</form.Field>

							<form.Field name="eventId">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												Pilih Event Terkait
											</FieldLabel>
											<select
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											>
												{events.map((event) => (
													<option key={event.id} value={event.id}>
														{event.name}
													</option>
												))}
											</select>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							</form.Field>

							<form.Field name="dueDate">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												Batas Waktu (Due Date)
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
											{isSubmitting ? 'Menyimpan...' : 'Simpan Tugas'}
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
