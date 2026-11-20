import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from '@/components/ui/sidebar'
import { apiClient } from '@/lib/apiClient'
import type { Team } from '@/types'

export const Route = createFileRoute('/_authed/team')({
	loader: async () => {
		try {
			const { data: teams } = await apiClient.get<Team[]>('/teams')
			if (!teams || teams.length === 0) {
				throw redirect({ to: '/onboard' })
			}
			return teams
		} catch (err) {
			if (err && typeof err === 'object' && 'to' in err) {
				throw err
			}
			console.error('Failed to load teams:', err)
			return []
		}
	},
	component: TeamLayout
})

function TeamLayout() {
	const teams = Route.useLoaderData()

	return (
		<SidebarProvider>
			<AppSidebar teams={teams} />
			<SidebarInset>
				<header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
					<div className="flex items-center gap-2">
						<SidebarTrigger />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbPage className="font-semibold text-foreground">
										Team Management & Task Tracking
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	)
}
