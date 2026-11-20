import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, CopyIcon, UserPlusIcon } from 'lucide-react'
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
import type { Team } from '@/types'

export const Route = createFileRoute('/_authed/team/$id/member/add')({
	loader: async ({ params }) => {
		try {
			const { data: team } = await apiClient.get<Team>(`/teams/${params.id}`)
			return { team }
		} catch (err) {
			console.error('Failed to load team info for member invite:', err)
			throw err
		}
	},
	component: AddMemberPage
})

function AddMemberPage() {
	const { team } = Route.useLoaderData()
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

	return (
		<div className="max-w-xl mx-auto space-y-4">
			<div>
				<Link
					to="/team/$id/member"
					params={{ id }}
					className={buttonVariants({ variant: 'ghost', size: 'sm' })}
				>
					<ArrowLeftIcon className="w-4 h-4 mr-1" />
					Kembali ke Daftar Anggota
				</Link>
			</div>

			<Card>
				<CardHeader>
					<div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
						<UserPlusIcon className="w-5 h-5" />
					</div>
					<CardTitle className="text-xl">Undang Anggota ke {team.name}</CardTitle>
					<CardDescription>
						Ikuti petunjuk di bawah ini untuk menambahkan anggota baru ke dalam tim Anda.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-3">
						<h3 className="text-sm font-semibold">Langkah 1: Bagikan Team ID</h3>
						<p className="text-xs text-muted-foreground">
							Kirimkan Team ID berikut kepada calon anggota yang ingin bergabung:
						</p>
						<div className="flex items-center gap-2">
							<div className="font-mono text-sm bg-muted border px-3 py-2 rounded-md font-semibold select-all flex-1 truncate">
								{team.id}
							</div>
							<Button variant="outline" size="sm" onClick={copyTeamId}>
								<CopyIcon className="w-4 h-4 mr-1" />
								{copied ? 'Tersalin' : 'Salin'}
							</Button>
						</div>
					</div>

					<div className="space-y-2 border-t pt-4">
						<h3 className="text-sm font-semibold">Langkah 2: Calon Anggota Bergabung</h3>
						<ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1">
							<li>Calon anggota melakukan registrasi dan masuk ke aplikasi.</li>
							<li>Calon anggota membuka menu <strong>Gabung ke Tim</strong>.</li>
							<li>Calon anggota menempelkan Team ID di atas dan klik <strong>Gabung Tim</strong>.</li>
							<li>Calon anggota otomatis terdaftar sebagai anggota resmi tim {team.name}.</li>
						</ol>
					</div>

					<div className="pt-2">
						<Link
							to="/team/$id/member"
							params={{ id }}
							className={`w-full ${buttonVariants({ variant: 'default' })}`}
						>
							Selesai &amp; Kembali ke Daftar Anggota
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
