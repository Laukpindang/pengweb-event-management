import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { ListTodoIcon, PencilIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
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
import { useAuth } from '@/lib/useAuth'
import type { Event, Task, TaskStatus } from '@/types'

export const Route = createFileRoute('/_authed/team/$id/my-task')({
	loader: async ({ params }) => {
		try {
			const { data: events } = await apiClient.get<Event[]>(
				`/teams/${params.id}/events`
			)

			const taskPromises = (events || []).map(async (event) => {
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
				events: events || [],
				tasks: allTasks
			}
		} catch (err) {
			console.error('Failed to load my tasks:', err)
			return { events: [], tasks: [] }
		}
	},
	component: MyTasksPage
})

function MyTasksPage() {
	const { events, tasks } = Route.useLoaderData()
	const { id } = Route.useParams()
	const { user } = useAuth()
	const router = useRouter()
	const [updatingId, setUpdatingId] = useState<string | null>(null)

	const eventMap = useMemo(
		() => new Map(events.map((e) => [e.id, e.name])),
		[events]
	)

	const myTasks = useMemo(() => {
		if (!user) return tasks
		const assigned = tasks.filter((t) => t.assigneeId === user.id)
		return assigned.length > 0 ? assigned : tasks
	}, [tasks, user])

	const handleStatusChange = async (
		eventId: string,
		taskId: string,
		newStatus: TaskStatus
	) => {
		try {
			setUpdatingId(taskId)
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
			let message = 'Gagal memperbarui status'
			if (isAxiosError(error) && error.response?.data?.message) {
				message = error.response.data.message
			}
			toast.add({
				title: 'Error',
				description: message,
				type: 'error'
			})
		} finally {
			setUpdatingId(null)
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Tugas Saya</h1>
				<p className="text-muted-foreground text-sm">
					Daftar tugas yang menjadi tanggung jawab Anda dalam tim ini
				</p>
			</div>

			{myTasks.length === 0 ? (
				<Card className="p-12 text-center">
					<ListTodoIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
					<CardTitle className="text-lg">Tidak Ada Tugas Tertunda</CardTitle>
					<CardDescription className="max-w-md mx-auto mt-1 mb-4">
						Anda tidak memiliki tugas yang sedang berjalan saat ini. Kerja
						bagus!
					</CardDescription>
					<Link
						to="/team/$id/task"
						params={{ id }}
						className={buttonVariants({ variant: 'outline' })}
					>
						Lihat Semua Tugas Tim
					</Link>
				</Card>
			) : (
				<div className="rounded-lg border bg-card">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Judul Tugas</TableHead>
								<TableHead>Deskripsi</TableHead>
								<TableHead>Event</TableHead>
								<TableHead>Batas Waktu</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{myTasks.map((task) => (
								<TableRow key={task.id}>
									<TableCell className="font-medium">{task.title}</TableCell>
									<TableCell className="max-w-xs truncate text-muted-foreground">
										{task.description}
									</TableCell>
									<TableCell className="text-xs">
										{eventMap.get(task.eventId) || 'Event tidak diketahui'}
									</TableCell>
									<TableCell className="text-xs whitespace-nowrap">
										{new Date(task.dueDate).toLocaleDateString('id-ID', {
											dateStyle: 'medium'
										})}
									</TableCell>
									<TableCell>
										<select
											value={task.status}
											disabled={updatingId === task.id}
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
											Detail &amp; Edit
										</Link>
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
