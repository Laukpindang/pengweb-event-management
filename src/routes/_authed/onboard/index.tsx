import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusCircleIcon, UsersIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

export const Route = createFileRoute('/_authed/onboard/')({
	component: OnboardPage
})

function OnboardPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
			<div className="text-center mb-8 max-w-lg">
				<h1 className="text-3xl font-bold tracking-tight">Selamat Datang di Team Management</h1>
				<p className="text-muted-foreground mt-2">
					Untuk memulai kolaborasi tim, Anda dapat membuat tim baru atau bergabung ke tim yang sudah ada menggunakan Team ID.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
				<Card className="hover:border-primary/50 transition-colors">
					<CardHeader>
						<div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
							<PlusCircleIcon className="w-5 h-5" />
						</div>
						<CardTitle>Buat Tim Baru</CardTitle>
						<CardDescription>
							Buat ruang kerja tim baru sebagai Owner, atur event, dan kelola tugas tim Anda.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link to="/onboard/setup" className={`w-full ${buttonVariants({ variant: 'default' })}`}>
							Buat Tim
						</Link>
					</CardContent>
				</Card>

				<Card className="hover:border-primary/50 transition-colors">
					<CardHeader>
						<div className="w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center mb-2">
							<UsersIcon className="w-5 h-5" />
						</div>
						<CardTitle>Gabung ke Tim</CardTitle>
						<CardDescription>
							Masukkan ID Tim yang dibagikan oleh ketua tim Anda untuk mulai berkolaborasi.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link to="/onboard/join" className={`w-full ${buttonVariants({ variant: 'outline' })}`}>
							Gabung dengan ID
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
