import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'

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
import { EditTaskSchema } from '@/schemas/tasks'
import type { Event, Task } from '@/types'

export const Route = createFileRoute(
	'/_authed/team/$id/event/$eventId/task/$taskId/edit'
)({
	loader: async ({ params }) => {
		try {
			const [taskRes, eventsRes] = await Promise.all([
				apiClient.get<Task>(`/tasks/${params.taskId}`),
				apiClient.get<Event[]>(`/teams/${params.id}/events`)
			])
			return {
				task: taskRes.data,
				events: eventsRes.data || []
			}
		} catch (err) {
			console.error('Failed to load task for edit:', err)
			throw err
		}
	},
	component: EditTaskPage
})

function EditTaskPage() {
	const { task, events } = Route.useLoaderData()
	const { id, taskId, eventId } = Route.useParams()
	const navigate = useNavigate()
	const [isDeleting, setIsDeleting] = useState(false)

	const initialDueDate = task.dueDate
		? new Date(task.dueDate).toISOString().slice(0, 16)
		: ''

	const form = useForm({
		validators: {
			onSubmit: EditTaskSchema
		},
		defaultValues: {
			title: task.title || '',
			description: task.description || '',
			dueDate: initialDueDate,
			eventId: task.eventId || (events[0]?.id ?? '')
		},
		onSubmit: async ({ value }) => {
			try {
				await apiClient.patch(`/tasks/${taskId}`, {
					title: value.title.trim(),
					description: value.description.trim(),
					dueDate: new Date(value.dueDate).toISOString(),
					eventId: value.eventId
				})
				toast.add({
					title: 'Sukses',
					description: 'Tugas berhasil diperbarui!',
					type: 'success'
				})
				navigate({
					to: '/team/$id/event/$eventId/task',
					params: { id, eventId }
				})
			} catch (error) {
				let message = 'Gagal memperbarui tugas'
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

	const handleDelete = async () => {
		if (
			!window.confirm(
				`Apakah Anda yakin ingin menghapus tugas "${task.title}"?`
			)
		) {
			return
		}

		try {
			setIsDeleting(true)
			await apiClient.delete(`/tasks/${taskId}`)
			toast.add({
				title: 'Sukses',
				description: 'Tugas berhasil dihapus!',
				type: 'success'
			})
			navigate({ to: '/team/$id/event/$eventId/task', params: { id, eventId } })
		} catch (error) {
			let message = 'Gagal menghapus tugas'
			if (isAxiosError(error) && error.response?.data?.message) {
				message = error.response.data.message
			}
			toast.add({
				title: 'Error',
				description: message,
				type: 'error'
			})
			setIsDeleting(false)
		}
	}

	return (
		<div className="max-w-xl mx-auto space-y-4">
			<div className="flex items-center justify-between">
				<Link
					to="/team/$id/event/$eventId/task"
					params={{ id, eventId }}
					className={buttonVariants({ variant: 'ghost', size: 'sm' })}
				>
					<ArrowLeftIcon className="w-4 h-4 mr-1" />
					Kembali ke Daftar Tugas
				</Link>

				<Button
					variant="destructive"
					size="sm"
					onClick={handleDelete}
					disabled={isDeleting}
				>
					<Trash2Icon className="w-4 h-4 mr-1" />
					{isDeleting ? 'Menghapus...' : 'Hapus Tugas'}
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Edit Tugas</CardTitle>
					<CardDescription>
						Perbarui detail tugas, deskripsi, batas waktu, atau event yang
						terkait.
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
											<FieldLabel htmlFor={field.name}>Judul Tugas</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
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

							<form.Field name="description">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Deskripsi</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
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
											{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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
