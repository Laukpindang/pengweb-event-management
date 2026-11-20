import { createFileRoute, Link } from '@tanstack/react-router'
import {
	ArrowRightIcon,
	CalendarIcon,
	CheckCircle2Icon,
	ClockIcon,
	CopyIcon,
	ListTodoIcon,
	PlusIcon,
	UsersIcon
} from 'lucide-react'
import { useState } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { apiClient } from '@/lib/apiClient'
import type { Task, Team, TeamStats } from '@/types'

export const Route = createFileRoute('/_authed/team/$id/')({
	loader: async ({ params }) => {
		try {
			const [statsRes, teamRes] = await Promise.all([
				apiClient.get<TeamStats>(`/teams/${params.id}/stats`),
				apiClient.get<Team>(`/teams/${params.id}`)
			])

			const statsData = statsRes.data
			const team = teamRes.data

			const eventItems = statsData.events?.items || []
			const taskPromises = eventItems.map(async (event) => {
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
			const allTeamTasks = taskArrays.flat()

			let totalTasks = 0
			let unassigned = 0
			let inProgress = 0
			let completed = 0

			for (const event of eventItems) {
				totalTasks += event.tasks.total
				unassigned += event.tasks.unassigned
				inProgress += event.tasks.inProgress
				completed += event.tasks.completed
			}

			const completionRate =
				totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0

			return {
				team,
				statsData,
				tasks: allTeamTasks,
				summary: {
					totalMembers: statsData.members,
					totalEvents: statsData.events?.total || 0,
					totalTasks,
					unassigned,
					inProgress,
					completed,
					completionRate
				}
			}
		} catch (err) {
			console.error('Failed to load team dashboard:', err)
			throw err
		}
	},
	component: TeamDashboard
})

function TeamDashboard() {
	const { team, statsData, tasks, summary } = Route.useLoaderData()
	const { id } = Route.useParams()
	const [copied, setCopied] = useState(false)

	const copyTeamId = () => {
		navigator.clipboard.writeText(team.id)
		setCopied(true)
		toast.add({
			title: 'ID Disalin',
			description: 'Team ID berhasil disalin ke clipboard!',
			type: 'success'
		})
		setTimeout(() => setCopied(false), 2000)
	}

	const events = statsData.events?.items || []

	return (
		<div className="space-y-8">
			{/* Team Header Banner */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl border bg-card shadow-sm">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight">
							{team.name}
						</h1>
					</div>
					<p className="text-muted-foreground text-sm max-w-2xl">
						{team.description}
					</p>
					<div className="flex flex-wrap items-center gap-3 pt-2">
						<span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
							ID: {team.id}
						</span>
						<Button
							variant="outline"
							size="xs"
							onClick={copyTeamId}
							className="text-xs"
						>
							<CopyIcon className="w-3 h-3 mr-1" />
							{copied ? 'Tersalin' : 'Salin ID'}
						</Button>
						<span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
							<UsersIcon className="w-3 h-3" />
							{summary.totalMembers} Anggota
						</span>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Link
						to="/team/$id/event/new"
						params={{ id }}
						className={buttonVariants({ variant: 'outline', size: 'sm' })}
					>
						<PlusIcon className="w-4 h-4 mr-1" />
						Event Baru
					</Link>
					<Link
						to="/team/$id/task/new"
						params={{ id }}
						className={buttonVariants({ variant: 'default', size: 'sm' })}
					>
						<PlusIcon className="w-4 h-4 mr-1" />
						Task Baru
					</Link>
				</div>
			</div>

			{/* Overall Statistics */}
			<div>
				<h2 className="text-lg font-semibold mb-4">Statistik Tim</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<Card>
						<CardHeader className="pb-2">
							<CardDescription className="flex items-center justify-between">
								Total Tugas
								<ListTodoIcon className="w-4 h-4 text-primary" />
							</CardDescription>
							<CardTitle className="text-3xl font-bold">
								{summary.totalTasks}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xs text-muted-foreground">
								{summary.completionRate}% selesai secara keseluruhan
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardDescription className="flex items-center justify-between">
								Belum Ditugaskan
								<ClockIcon className="w-4 h-4 text-amber-500" />
							</CardDescription>
							<CardTitle className="text-3xl font-bold text-amber-500">
								{summary.unassigned}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xs text-muted-foreground">
								Menunggu alokasi anggota
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardDescription className="flex items-center justify-between">
								Sedang Berjalan
								<ClockIcon className="w-4 h-4 text-blue-500" />
							</CardDescription>
							<CardTitle className="text-3xl font-bold text-blue-500">
								{summary.inProgress}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xs text-muted-foreground">
								Dalam tahap pengerjaan
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardDescription className="flex items-center justify-between">
								Selesai
								<CheckCircle2Icon className="w-4 h-4 text-green-500" />
							</CardDescription>
							<CardTitle className="text-3xl font-bold text-green-500">
								{summary.completed}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xs text-muted-foreground">
								Tugas berhasil diselesaikan
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Events Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-lg font-semibold">Event Tim</h2>
						<p className="text-sm text-muted-foreground">
							Agenda dan milestone yang sedang berlangsung
						</p>
					</div>
					<Link
						to="/team/$id/event"
						params={{ id }}
						className={buttonVariants({ variant: 'ghost', size: 'sm' })}
					>
						Lihat Semua Event <ArrowRightIcon className="w-4 h-4 ml-1" />
					</Link>
				</div>

				{events.length === 0 ? (
					<Card className="p-8 text-center">
						<CalendarIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
						<h3 className="font-semibold text-lg">Belum Ada Event</h3>
						<p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
							Buat event pertama Anda untuk mengelompokkan tugas-tugas tim
							berdasarkan agenda kegiatan atau proyek.
						</p>
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
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{events.slice(0, 3).map((event) => (
							<Card key={event.id} className="flex flex-col justify-between">
								<CardHeader className="pb-3">
									<CardTitle className="text-base font-semibold truncate">
										{event.name}
									</CardTitle>
									<CardDescription className="text-xs text-muted-foreground">
										{new Date(event.startTime).toLocaleDateString('id-ID')} -{' '}
										{new Date(event.endTime).toLocaleDateString('id-ID')}
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="space-y-1">
										<div className="flex justify-between text-xs font-medium">
											<span>Progress Tugas</span>
											<span>
												{event.tasks.completed}/{event.tasks.total} (
												{event.tasks.completionPercentage}%)
											</span>
										</div>
										<div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
											<div
												className="h-full bg-primary transition-all duration-300"
												style={{
													width: `${event.tasks.completionPercentage}%`
												}}
											/>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>

			{/* Recent Tasks Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-lg font-semibold">Tugas Terbaru</h2>
						<p className="text-sm text-muted-foreground">
							Daftar tugas yang perlu diselesaikan oleh anggota tim
						</p>
					</div>
					<Link
						to="/team/$id/task"
						params={{ id }}
						className={buttonVariants({ variant: 'ghost', size: 'sm' })}
					>
						Lihat Semua Tugas <ArrowRightIcon className="w-4 h-4 ml-1" />
					</Link>
				</div>

				{tasks.length === 0 ? (
					<Card className="p-8 text-center">
						<ListTodoIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
						<h3 className="font-semibold text-lg">Belum Ada Tugas</h3>
						<p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
							Tambahkan tugas ke event yang sudah dibuat agar anggota tim dapat
							mulai bekerja.
						</p>
						<Link
							to="/team/$id/task/new"
							params={{ id }}
							className={buttonVariants({ variant: 'default' })}
						>
							<PlusIcon className="w-4 h-4 mr-1" />
							Buat Tugas Baru
						</Link>
					</Card>
				) : (
					<div className="divide-y rounded-lg border bg-card">
						{tasks.slice(0, 5).map((task) => (
							<div
								key={task.id}
								className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 hover:bg-muted/40 transition-colors"
							>
								<div className="space-y-1">
									<p className="font-medium text-sm">{task.title}</p>
									<p className="text-xs text-muted-foreground line-clamp-1">
										{task.description}
									</p>
								</div>
								<div className="flex items-center gap-3 shrink-0">
									<span className="text-xs text-muted-foreground">
										Deadline:{' '}
										{new Date(task.dueDate).toLocaleDateString('id-ID')}
									</span>
									<span
										className={`text-xs px-2 py-0.5 rounded-full font-medium ${
											task.status === 'COMPLETED'
												? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
												: task.status === 'IN_PROGRESS'
													? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
													: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
										}`}
									>
										{task.status === 'COMPLETED'
											? 'Selesai'
											: task.status === 'IN_PROGRESS'
												? 'Sedang Berjalan'
												: 'Belum Ditugaskan'}
									</span>
									<Link
										to="/team/$id/task/$taskId/edit"
										params={{ id, taskId: task.id }}
										search={{ eventId: task.eventId }}
										className={buttonVariants({
											variant: 'outline',
											size: 'xs'
										})}
									>
										Edit
									</Link>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
