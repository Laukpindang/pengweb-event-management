import { createFileRoute, Link } from '@tanstack/react-router'
import { RotateCcwIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

type Member = {
	id: number
	name: string
	username: string
	email: string
	address: {
		street: string
		suite: string
		city: string
		zipcode: string
		geo: {
			lat: string
			lng: string
		}
	}
	phone: string
	website: string
	company: {
		name: string
		catchPhrase: string
		bs: string
	}
}

export const Route = createFileRoute('/_authed/team/$id/member/')({
	component: RouteComponent
})

function RouteComponent() {
	const { id } = Route.useParams()

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [members, setMembers] = useState<Member[]>([])

	const getData = useCallback(() => {
		setLoading(true)
		setError(false)
		fetch(`https://jsonplaceholder.typicode.com/users`)
			.then(async (response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok')
				}
				setMembers(await response.json())
			})
			.catch(() => {
				setError(true)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	useEffect(() => {
		getData()
	}, [getData])

	return (
		<div>
			<div className="mb-10 flex justify-between items-end">
				<h1 className="text-3xl">Members List</h1>
				<Link
					to="/team/$id/member/add"
					params={{ id }}
					className={buttonVariants({ variant: 'default' })}
				>
					Tambah Anggota
				</Link>
			</div>
			{loading ? (
				<div>
					<Skeleton className="h-64 w-full" />
				</div>
			) : error ? (
				<div>
					<p className="text-red-500 mb-5">Gagal mengambil data anggota</p>
					<Button onClick={getData}>
						<RotateCcwIcon />
						Coba lagi
					</Button>
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{members.map((member) => (
							<TableRow key={member.id}>
								<TableCell>{member.name}</TableCell>
								<TableCell>{member.email}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	)
}
