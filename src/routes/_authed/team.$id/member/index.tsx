import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import {
	CopyIcon,
	ShieldCheckIcon,
	Trash2Icon,
	UserPlusIcon,
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
import type { Team, TeamMember } from '@/types'

export const Route = createFileRoute('/_authed/team/$id/member/')({
	loader: async ({ params }) => {
		try {
			const [teamRes, membersRes] = await Promise.all([
				apiClient.get<Team>(`/teams/${params.id}`),
				apiClient.get<TeamMember[]>(`/teams/${params.id}/members`)
			])
			return {
				team: teamRes.data,
				members: membersRes.data || []
			}
		} catch (err) {
			console.error('Failed to load team members:', err)
			throw err
		}
	},
	component: MembersPage
})

function MembersPage() {
	const { team, members } = Route.useLoaderData()
	const { id } = Route.useParams()
	const { user } = useAuth()
	const router = useRouter()
	const [copied, setCopied] = useState(false)
	const [removingId, setRemovingId] = useState<string | null>(null)

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

	const handleRemoveMember = async (memberId: string, memberName: string) => {
		if (!window.confirm(`Apakah Anda yakin ingin mengeluarkan ${memberName} dari tim?`)) {
			return
		}

		try {
			setRemovingId(memberId)
			await apiClient.delete(`/teams/${id}/members/${memberId}`)
			toast.add({
				title: 'Sukses',
				description: `${memberName} telah dikeluarkan dari tim`,
				type: 'success'
			})
			await router.invalidate()
		} catch (error) {
			let message = 'Gagal mengeluarkan anggota'
			if (isAxiosError(error) && error.response?.data?.message) {
				message = error.response.data.message
			}
			toast.add({
				title: 'Error',
				description: message,
				type: 'error'
			})
		} finally {
			setRemovingId(null)
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Anggota Tim</h1>
					<p className="text-muted-foreground text-sm">
						Daftar anggota aktif dalam tim {team.name}
					</p>
				</div>
				<Link
					to="/team/$id/member/add"
					params={{ id }}
					className={buttonVariants({ variant: 'default' })}
				>
					<UserPlusIcon className="w-4 h-4 mr-1" />
					Undang Anggota
				</Link>
			</div>

			{/* Team ID Invitation Banner */}
			<Card className="border-primary/20 bg-primary/5">
				<CardHeader className="pb-3">
					<CardTitle className="text-base flex items-center gap-2">
						<UsersIcon className="w-5 h-5 text-primary" />
						Undang Rekan ke Tim Ini
					</CardTitle>
					<CardDescription>
						Bagikan Team ID di bawah ini kepada rekan kerja Anda. Mereka dapat memasukkan ID ini di menu &quot;Gabung Tim&quot; setelah login.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
						<div className="font-mono text-sm bg-background border px-3 py-1.5 rounded-md font-semibold select-all">
							{team.id}
						</div>
						<Button variant="outline" size="sm" onClick={copyTeamId}>
							<CopyIcon className="w-4 h-4 mr-1" />
							{copied ? 'Tersalin!' : 'Salin Team ID'}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Members Table */}
			<div className="space-y-2">
				<h2 className="text-lg font-semibold">
					Daftar Anggota ({members.length})
				</h2>
				<div className="rounded-lg border bg-card">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nama</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Peran (Role)</TableHead>
								<TableHead>Bergabung Sejak</TableHead>
								<TableHead className="text-right">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{members.map((member) => {
								const isCurrentUser = member.user.id === user?.id
								return (
									<TableRow key={member.id}>
										<TableCell className="font-semibold">
											<div className="flex items-center gap-2">
												<div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
													{member.user.name?.charAt(0).toUpperCase() || 'U'}
												</div>
												<span>{member.user.name}</span>
												{isCurrentUser && (
													<span className="text-xs text-muted-foreground font-normal">
														(Anda)
													</span>
												)}
											</div>
										</TableCell>
										<TableCell>{member.user.email}</TableCell>
										<TableCell>
											<span
												className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
													member.role === 'OWNER'
														? 'bg-primary/15 text-primary font-semibold'
														: 'bg-muted text-muted-foreground'
												}`}
											>
												<ShieldCheckIcon className="w-3 h-3" />
												{member.role}
											</span>
										</TableCell>
										<TableCell className="text-xs text-muted-foreground whitespace-nowrap">
											{new Date(member.createdAt).toLocaleDateString('id-ID', {
												dateStyle: 'medium'
											})}
										</TableCell>
										<TableCell className="text-right">
											{!isCurrentUser && (
												<Button
													variant="destructive"
													size="xs"
													disabled={removingId === member.id}
													onClick={() =>
														handleRemoveMember(member.id, member.user.name)
													}
												>
													<Trash2Icon className="w-3.5 h-3.5 mr-1" />
													Keluarkan
												</Button>
											)}
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	)
}
