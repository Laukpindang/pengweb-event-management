import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { CalendarIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardDescription,
	CardTitle
} from '@/components/ui/card'
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
import type { Event, Task } from '@/types'

export const Route = createFileRoute('/_authed/team/$id/event/')({
	loader: async ({ params }) => {
		try {
			const { data: events } = await apiClient.get<Event[]>(
				`/teams/${params.id}/events`
			)

			// Fetch tasks for each event from new endpoint /events/:eventId/tasks
			const eventsWithTasks = await Promise.all(
				(events || []).map(async (event) => {
					try {
						const { data: tasks } = await apiClient.get<Task[]>(
							`/events/${event.id}/tasks`
						)
						const completedCount = (tasks || []).filter(
							(t) => t.status === 'COMPLETED'
						).length
						return {
							...event,
							totalTasks: tasks?.length || 0,
							completedTasks: completedCount
						}
					} catch {
						return {
							...event,
							totalTasks: 0,
							completedTasks: 0
						}
					}
				})
			)

			return { events: eventsWithTasks }
		} catch (err) {
			console.error('Failed to load events:', err)
			return { events: [] }
		}
	},
	component: EventsPage
})

function EventsPage() {
	const { events } = Route.useLoaderData()
	const { id } = Route.useParams()
	const router = useRouter()
	const [deletingId, setDeletingId] = useState<string | null>(null)

	const handleDelete = async (eventId: string, eventName: string) => {
		if (
			!window.confirm(
				`Apakah Anda yakin ingin menghapus event "${eventName}"? Semua tugas terkait akan dihapus.`
			)
		) {
			return
		}

		try {
			setDeletingId(eventId)
			await apiClient.delete(`/teams/${id}/events/${eventId}`)
			toast.add({
				title: 'Sukses',
				description: 'Event berhasil dihapus',
				type: 'success'
			})
			await router.invalidate()
		} catch (error) {
			let message = 'Gagal menghapus event'
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

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Daftar Event Tim</h1>
					<p className="text-muted-foreground text-sm">
						Kelola semua event, milestone, dan agenda kegiatan tim Anda
					</p>
				</div>
				<Link
					to="/team/$id/event/new"
					params={{ id }}
					className={buttonVariants({ variant: 'default' })}
				>
					<PlusIcon className="w-4 h-4 mr-1" />
					Buat Event Baru
				</Link>
			</div>

			{events.length === 0 ? (
				<Card className="p-12 text-center">
					<CalendarIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
					<CardTitle className="text-lg">Belum Ada Event</CardTitle>
					<CardDescription className="max-w-md mx-auto mt-1 mb-4">
						Event diperlukan sebagai wadah pengelompokan tugas dan aktivitas tim.
					</CardDescription>
					<Link
						to="/team/$id/event/new"
						params={{ id }}
						className={buttonVariants({ variant: 'default' })}
					>
						<PlusIcon className="w-4 h-4 mr-1" />
						Buat Event Sekarang
					</Link>
				</Card>
			) : (
				<div className="rounded-lg border bg-card">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nama Event</TableHead>
								<TableHead>Deskripsi</TableHead>
								<TableHead>Waktu Mulai</TableHead>
								<TableHead>Waktu Selesai</TableHead>
								<TableHead className="text-center">Tugas</TableHead>
								<TableHead className="text-right">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{events.map((event) => (
								<TableRow key={event.id}>
									<TableCell className="font-semibold">{event.name}</TableCell>
									<TableCell className="max-w-xs truncate text-muted-foreground">
										{event.description}
									</TableCell>
									<TableCell className="text-xs whitespace-nowrap">
										{new Date(event.startTime).toLocaleString('id-ID', {
											dateStyle: 'medium',
											timeStyle: 'short'
										})}
									</TableCell>
									<TableCell className="text-xs whitespace-nowrap">
										{new Date(event.endTime).toLocaleString('id-ID', {
											dateStyle: 'medium',
											timeStyle: 'short'
										})}
									</TableCell>
									<TableCell className="text-center">
										<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
											{event.completedTasks}/{event.totalTasks} Selesai
										</span>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2">
											<Link
												to="/team/$id/task"
												params={{ id }}
												className={buttonVariants({
													variant: 'outline',
													size: 'xs'
												})}
											>
												Lihat Tugas
											</Link>
											<Button
												variant="destructive"
												size="xs"
												disabled={deletingId === event.id}
												onClick={() => handleDelete(event.id, event.name)}
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
