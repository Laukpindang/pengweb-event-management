import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import {
	CalendarIcon,
	FilterIcon,
	PencilIcon,
	PlusIcon,
	Trash2Icon,
	UserIcon
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { apiClient } from '@/lib/apiClient'
import type { Event, Task, TaskStatus, TeamMember } from '@/types'

export const Route = createFileRoute('/_authed/team/$id/task/')({
	loader: async ({ params }) => {
		try {
			const [eventsRes, membersRes] = await Promise.all([
				apiClient.get<Event[]>(`/teams/${params.id}/events`),
				apiClient.get<TeamMember[]>(`/teams/${params.id}/members`)
			])

			const events = eventsRes.data || []
			const members = membersRes.data || []

			const taskPromises = events.map(async (event) => {
				try {
					const { data: tasks } = await apiClient.get<Task[]>(
						`/events/${event.id}/tasks`
					)
					return tasks || []
				} catch {
					return []
				}
			})

			const taskArrays = await Promise.all(taskPromises)
			const allTasks = taskArrays.flat()

			return {
				events,
				members,
				tasks: allTasks
			}
		} catch (err) {
			console.error('Failed to load tasks:', err)
			return { events: [], members: [], tasks: [] }
		}
	},
	component: TasksPage
})

function TasksPage() {
	const { events, members, tasks } = Route.useLoaderData()
	const { id } = Route.useParams()
	const router = useRouter()

	const [selectedEventId, setSelectedEventId] = useState<string>('all')
	const [selectedStatus, setSelectedStatus] = useState<string>('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

	const eventMap = useMemo(
		() => new Map(events.map((e) => [e.id, e.name])),
		[events]
	)
	const memberMap = useMemo(
		() => new Map(members.map((m) => [m.user.id, m.user.name])),
		[members]
	)

	const filteredTasks = useMemo(() => {
		return tasks.filter((task) => {
			if (selectedEventId !== 'all' && task.eventId !== selectedEventId) {
				return false
			}
			if (selectedStatus !== 'all' && task.status !== selectedStatus) {
				return false
			}
			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase()
				const matchTitle = task.title.toLowerCase().includes(query)
				const matchDesc = task.description.toLowerCase().includes(query)
				if (!matchTitle && !matchDesc) return false
			}
			return true
		})
	}, [tasks, selectedEventId, selectedStatus, searchQuery])

	const handleDelete = async (
		eventId: string,
		taskId: string,
		title: string
	) => {
		if (
			!window.confirm(`Apakah Anda yakin ingin menghapus tugas "${title}"?`)
		) {
			return
		}

		try {
			setDeletingId(taskId)
			await apiClient.delete(`/events/${eventId}/tasks/${taskId}`)
			toast.add({
				title: 'Sukses',
				description: 'Tugas berhasil dihapus',
				type: 'success'
			})
			await router.invalidate()
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
		} finally {
			setDeletingId(null)
		}
	}

	const handleStatusChange = async (
		eventId: string,
		taskId: string,
		newStatus: TaskStatus
	) => {
		try {
			setUpdatingStatusId(taskId)
			await apiClient.patch(`/events/${eventId}/tasks/${taskId}`, {
				status: newStatus
			})
			toast.add({
				title: 'Status Diperbarui',
				description: `Status tugas diubah menjadi ${newStatus}`,
				type: 'success'
			})
			await router.invalidate()
		} catch (error) {
			let message = 'Gagal memperbarui status tugas'
			if (isAxiosError(error) && error.response?.data?.message) {
				message = error.response.data.message
			}
			toast.add({
				title: 'Error',
				description: message,
				type: 'error'
			})
		} finally {
			setUpdatingStatusId(null)
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Daftar Tugas Tim
					</h1>
					<p className="text-muted-foreground text-sm">
						Kelola dan pantau progress tugas-tugas tim untuk setiap event
					</p>
				</div>
				<Link
					to="/team/$id/task/new"
					params={{ id }}
					className={buttonVariants({ variant: 'default' })}
				>
					<PlusIcon className="w-4 h-4 mr-1" />
					Buat Tugas Baru
				</Link>
			</div>

			{events.length === 0 && (
				<div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-4">
					<div className="flex items-center gap-2 text-sm">
						<CalendarIcon className="w-4 h-4 shrink-0" />
						<span>
							Tim Anda belum memiliki event. Tugas harus dikaitkan dengan sebuah
							event.
						</span>
					</div>
					<Link
						to="/team/$id/event/new"
						params={{ id }}
						className={buttonVariants({ variant: 'outline', size: 'sm' })}
					>
						Buat Event
					</Link>
				</div>
			)}

			{/* Filters Bar */}
			<div className="flex flex-wrap items-center gap-3 p-3 rounded-lg border bg-card">
				<div className="flex-1 min-w-50">
					<Input
						placeholder="Cari tugas berdasarkan judul atau deskripsi..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="h-9 text-sm"
					/>
				</div>

				<div className="flex items-center gap-2">
					<FilterIcon className="w-4 h-4 text-muted-foreground" />
					<select
						value={selectedEventId}
						onChange={(e) => setSelectedEventId(e.target.value)}
						className="h-9 px-3 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					>
						<option value="all">Semua Event</option>
						{events.map((e) => (
							<option key={e.id} value={e.id}>
								{e.name}
							</option>
						))}
					</select>

					<select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value)}
						className="h-9 px-3 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					>
						<option value="all">Semua Status</option>
						<option value="UNASSIGNED">Belum Ditugaskan</option>
						<option value="IN_PROGRESS">Sedang Berjalan</option>
						<option value="COMPLETED">Selesai</option>
					</select>
				</div>
			</div>

			{filteredTasks.length === 0 ? (
				<Card className="p-12 text-center">
					<CardTitle className="text-lg">Tidak Ada Tugas yang Cocok</CardTitle>
					<CardDescription className="max-w-md mx-auto mt-1 mb-4">
						{tasks.length === 0
							? 'Belum ada tugas yang dibuat untuk tim ini. Mulai dengan membuat tugas baru.'
							: 'Tidak ada tugas yang sesuai dengan filter pencarian Anda.'}
					</CardDescription>
					{tasks.length === 0 && events.length > 0 && (
						<Link
							to="/team/$id/task/new"
							params={{ id }}
							className={buttonVariants({ variant: 'default' })}
						>
							<PlusIcon className="w-4 h-4 mr-1" />
							Buat Tugas Sekarang
						</Link>
					)}
				</Card>
			) : (
				<div className="rounded-lg border bg-card">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Judul Tugas</TableHead>
								<TableHead>Deskripsi</TableHead>
								<TableHead>Event Terkait</TableHead>
								<TableHead>Ditugaskan Kepada</TableHead>
								<TableHead>Batas Waktu</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredTasks.map((task) => (
								<TableRow key={task.id}>
									<TableCell className="font-medium">{task.title}</TableCell>
									<TableCell className="max-w-xs truncate text-muted-foreground">
										{task.description}
									</TableCell>
									<TableCell className="text-xs whitespace-nowrap">
										<span className="font-medium text-foreground">
											{eventMap.get(task.eventId) || 'Event tidak diketahui'}
										</span>
									</TableCell>
									<TableCell className="text-xs whitespace-nowrap">
										{task.assigneeId && memberMap.has(task.assigneeId) ? (
											<span className="inline-flex items-center gap-1 font-medium text-primary">
												<UserIcon className="w-3.5 h-3.5" />
												{memberMap.get(task.assigneeId)}
											</span>
										) : (
											<span className="text-muted-foreground italic">
												Belum ditugaskan
											</span>
										)}
									</TableCell>
									<TableCell className="text-xs whitespace-nowrap">
										{new Date(task.dueDate).toLocaleDateString('id-ID', {
											dateStyle: 'medium'
										})}
									</TableCell>
									<TableCell>
										<select
											value={task.status}
											disabled={updatingStatusId === task.id}
											onChange={(e) =>
												handleStatusChange(
													task.eventId,
													task.id,
													e.target.value as TaskStatus
												)
											}
											className={`text-xs px-2 py-1 rounded font-medium border bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring ${
												task.status === 'COMPLETED'
													? 'border-green-300 text-green-700 bg-green-50 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800'
													: task.status === 'IN_PROGRESS'
														? 'border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
														: 'border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
											}`}
										>
											<option value="UNASSIGNED">Belum Ditugaskan</option>
											<option value="IN_PROGRESS">Sedang Berjalan</option>
											<option value="COMPLETED">Selesai</option>
										</select>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2">
											<Link
												to="/team/$id/task/$taskId/edit"
												params={{ id, taskId: task.id }}
												search={{ eventId: task.eventId }}
												className={buttonVariants({
													variant: 'outline',
													size: 'xs'
												})}
											>
												<PencilIcon className="w-3.5 h-3.5 mr-1" />
												Edit
											</Link>
											<Button
												variant="destructive"
												size="xs"
												disabled={deletingId === task.id}
												onClick={() =>
													handleDelete(task.eventId, task.id, task.title)
												}
											>
												<Trash2Icon className="w-3.5 h-3.5" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	)
}
