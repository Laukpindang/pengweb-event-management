import type { LinkProps } from '@tanstack/react-router'
import { Link, useMatchRoute, useParams } from '@tanstack/react-router'
import { TeamSwitcher } from '@/components/team-switcher'
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail
} from '@/components/ui/sidebar'

interface TypeTeam {
	id: string
	name: string
	description: string
}

const navMenu = [
	{ title: 'Dashboard', to: '/team/$id' },
	{ title: 'Member', to: '/team/$id/member' },
	{ title: 'Event', to: '/team/$id/event' },
	{ title: 'My Task', to: '/team/$id/my-task' }
] as const satisfies Array<{
	title: string
	to: LinkProps['to']
}>

export function AppSidebar({
	teams,
	...props
}: React.ComponentProps<typeof Sidebar> & { teams: TypeTeam[] }) {
	const params = useParams({ strict: false }) as { id?: string }
	const teamId = params.id || ''

	const matchRoute = useMatchRoute()

	return (
		<Sidebar className="border-r-0" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={teams} />
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu className="px-2">
					{navMenu.map((item) => {
						const isActive = !!matchRoute({
							to: item.to,
							params: { id: teamId }
						})
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									isActive={isActive}
									render={<Link to={item.to} params={{ id: teamId }} />}
								>
									<span>{item.title}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)
					})}
				</SidebarMenu>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}
