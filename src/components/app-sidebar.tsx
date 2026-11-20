import type { LinkProps } from '@tanstack/react-router'
import {
	Link,
	useMatchRoute,
	useNavigate,
	useParams
} from '@tanstack/react-router'
import {
	CalendarIcon,
	CheckSquareIcon,
	LayoutDashboardIcon,
	LogOutIcon,
	UserCheckIcon,
	UsersIcon
} from 'lucide-react'
import { TeamSwitcher } from '@/components/team-switcher'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail
} from '@/components/ui/sidebar'
import { useAuth } from '@/lib/useAuth'
import type { Team } from '@/types'

const navMenu = [
	{ title: 'Dashboard', to: '/team/$id', icon: LayoutDashboardIcon },
	{ title: 'Event', to: '/team/$id/event', icon: CalendarIcon },
	{ title: 'Tasks', to: '/team/$id/task', icon: CheckSquareIcon },
	{ title: 'Member', to: '/team/$id/member', icon: UsersIcon },
	{ title: 'My Task', to: '/team/$id/my-task', icon: UserCheckIcon }
] as const satisfies Array<{
	title: string
	to: LinkProps['to']
	icon: React.ComponentType<{ className?: string }>
}>

export function AppSidebar({
	teams,
	...props
}: React.ComponentProps<typeof Sidebar> & { teams: Team[] }) {
	const params = useParams({ strict: false }) as { id?: string }
	const teamId = params.id || ''
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const matchRoute = useMatchRoute()

	const handleLogout = () => {
		logout()
		navigate({ to: '/auth/sign-in', search: { redirect: '/' } })
	}

	return (
		<Sidebar className="border-r" {...props}>
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
						const Icon = item.icon
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									isActive={isActive}
									render={<Link to={item.to} params={{ id: teamId }} />}
									className="gap-3"
								>
									<Icon className="size-4 shrink-0" />
									<span>{item.title}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)
					})}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter className="border-t p-3">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 truncate min-w-0">
						<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
							{user?.name?.charAt(0).toUpperCase() || 'U'}
						</div>
						<div className="truncate">
							<p className="text-xs font-medium truncate">
								{user?.name || 'User'}
							</p>
							<p className="text-[10px] text-muted-foreground truncate">
								{user?.email}
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={handleLogout}
						title="Keluar / Logout"
						className="inline-flex size-7 items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
					>
						<LogOutIcon className="size-4" />
					</button>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
