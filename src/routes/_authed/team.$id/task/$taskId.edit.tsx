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
import { toast } from '@/components/ui/toast'
import { apiClient } from '@/lib/apiClient'
import { UpdateTaskSchema } from '@/schemas/tasks'
import type { Event, Task, TeamMember } from '@/types'

export const Route = createFileRoute('/_authed/team/$id/task/$taskId/edit')({
	validateSearch: (search: Record<string, unknown>) => ({
		eventId: typeof search.eventId === 'string' ? search.eventId : undefined
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ params, deps }) => {
		try {
			const [eventsRes, membersRes] = await Promise.all([
				apiClient.get<Event[]>(`/teams/${params.id}/events`),
				apiClient.get<TeamMember[]>(`/teams/${params.id}/members`)
			])

			const events = eventsRes.data || []
			const members = membersRes.data || []

			let targetTask: Task | null = null

			if (deps.eventId) {
				try {
					const { data: task } = await apiClient.get<Task>(
						`/events/${deps.eventId}/tasks/${params.taskId}`
					)
					targetTask = task
				} catch {}
			}

			if (!targetTask) {
				for (const event of events) {
					try {
						const { data: task } = await apiClient.get<Task>(
							`/events/${event.id}/tasks/${params.taskId}`
						)
						if (task) {
							targetTask = task
							break
						}
					} catch {}
				}
			}

			if (!targetTask) {
				throw new Error('Tugas tidak ditemukan')
			}

			return {
				task: targetTask,
				events,
				members
			}
		} catch (err) {
			console.error('Failed to load task for edit:', err)
			throw err
		}
	},
	component: EditTaskPage
})

function EditTaskPage() {
	const { task, events, members } = Route.useLoaderData()
	const { id, taskId } = Route.useParams()
	const navigate = useNavigate()
	const [isDeleting, setIsDeleting] = useState(false)

	const eventName =
		events.find((e) => e.id === task.eventId)?.name || 'Event tidak diketahui'

	const form = useForm({
		validators: {
			onSubmit: UpdateTaskSchema
		},
		defaultValues: {
			status: task.status,
			assigneeId: task.assigneeId
		},
		onSubmit: async ({ value }) => {
			try {
				await apiClient.patch(`/events/${task.eventId}/tasks/${taskId}`, {
					status: value.status,
					assigneeId: value.assigneeId ? value.assigneeId : undefined
				})
				toast.add({
					title: 'Sukses',
					description: 'Tugas berhasil diperbarui!',
					type: 'success'
				})
				navigate({ to: '/team/$id/task', params: { id } })
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
			await apiClient.delete(`/events/${task.eventId}/tasks/${taskId}`)
			toast.add({
				title: 'Sukses',
				description: 'Tugas berhasil dihapus!',
				type: 'success'
			})
			navigate({ to: '/team/$id/task', params: { id } })
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
					to="/team/$id/task"
					params={{ id }}
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
					<CardTitle className="text-xl">Detail &amp; Edit Tugas</CardTitle>
					<CardDescription>
						Perbarui status dan alokasi anggota untuk tugas ini.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Readonly Task Information */}
					<div className="p-4 rounded-lg bg-muted/50 border space-y-3">
						<div>
							<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								Judul Tugas
							</span>
							<p className="text-base font-semibold mt-0.5">{task.title}</p>
						</div>

						<div>
							<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								Deskripsi
							</span>
							<p className="text-sm text-muted-foreground mt-0.5">
								{task.description}
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4 pt-2 border-t text-xs">
							<div>
								<span className="text-muted-foreground">Event Terkait:</span>
								<p className="font-medium mt-0.5">{eventName}</p>
							</div>
							<div>
								<span className="text-muted-foreground">Batas Waktu:</span>
								<p className="font-medium mt-0.5">
									{new Date(task.dueDate).toLocaleString('id-ID', {
										dateStyle: 'medium',
										timeStyle: 'short'
									})}
								</p>
							</div>
						</div>
					</div>

					{/* Update Status and Assignee Form */}
					<form
						onSubmit={(e) => {
							e.preventDefault()
							form.handleSubmit()
						}}
					>
						<FieldGroup>
							<form.Field name="status">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												Status Pengerjaan
											</FieldLabel>
											<select
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={(e) =>
													field.handleChange(
														e.target.value as
															| 'UNASSIGNED'
															| 'IN_PROGRESS'
															| 'COMPLETED'
													)
												}
												onBlur={field.handleBlur}
												className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											>
												<option value="UNASSIGNED">
													Belum Ditugaskan (UNASSIGNED)
												</option>
												<option value="IN_PROGRESS">
													Sedang Berjalan (IN_PROGRESS)
												</option>
												<option value="COMPLETED">Selesai (COMPLETED)</option>
											</select>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							</form.Field>

							<form.Field name="assigneeId">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>
											Tugaskan Kepada Anggota
										</FieldLabel>
										<select
											id={field.name}
											name={field.name}
											value={field.state.value || ''}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										>
											<option value="">Belum Ditugaskan (Unassigned)</option>
											{members.map((member) => (
												<option key={member.user.id} value={member.user.id}>
													{member.user.name} ({member.user.email})
												</option>
											))}
										</select>
									</Field>
								)}
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
