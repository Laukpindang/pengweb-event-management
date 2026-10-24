import { createFileRoute, Outlet } from '@tanstack/react-router'

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

export const Route = createFileRoute('/_authed/team')({
	loader: async () => [
		{
			id: '1',
			name: 'Team 1',
			description: 'Description 1'
		},
		{
			id: '2',
			name: 'Team 2',
			description: 'Description 2'
		}
	],
	component: TeamLayout
})

function TeamLayout() {
	const teams = Route.useLoaderData()

	return (
		<SidebarProvider>
			<AppSidebar teams={teams} />
			<SidebarInset>
				<header className="flex h-14 shrink-0 items-center gap-2">
					<div className="flex flex-1 items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbPage className="line-clamp-1">
										Team Management & Task Tracking
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<main className="px-5">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	)
}
