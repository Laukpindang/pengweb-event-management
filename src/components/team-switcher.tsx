import { useNavigate, useParams } from '@tanstack/react-router'
import { CheckIcon, ChevronsUpDownIcon, PlusIcon, UserPlusIcon } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar'
import type { Team } from '@/types'

export function TeamSwitcher({
	teams
}: {
	teams: Team[]
}) {
	const params = useParams({ strict: false }) as { id?: string }
	const navigate = useNavigate()
	const currentTeamId = params.id

	const activeTeam = teams.find((t) => t.id === currentTeamId) || teams[0]

	if (!activeTeam) {
		return null
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							/>
						}
					>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
							{activeTeam.name.charAt(0).toUpperCase()}
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">{activeTeam.name}</span>
							<span className="truncate text-xs text-muted-foreground">
								{activeTeam.role ? `Role: ${activeTeam.role}` : 'Ruang Kerja'}
							</span>
						</div>
						<ChevronsUpDownIcon className="ml-auto size-4 opacity-50" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-64 rounded-lg"
						align="start"
						side="bottom"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="text-xs text-muted-foreground">
								Daftar Tim Anda
							</DropdownMenuLabel>
							{teams.map((team) => (
								<DropdownMenuItem
									key={team.id}
									onClick={() => navigate({ to: '/team/$id', params: { id: team.id } })}
									className="gap-2 p-2 cursor-pointer"
								>
									<div className="flex size-6 items-center justify-center rounded-sm border bg-muted text-xs font-medium">
										{team.name.charAt(0).toUpperCase()}
									</div>
									<div className="flex flex-col flex-1 truncate">
										<span className="truncate font-medium">{team.name}</span>
										{team.role && (
											<span className="text-[10px] text-muted-foreground">
												{team.role}
											</span>
										)}
									</div>
									{team.id === activeTeam.id && (
										<CheckIcon className="size-4 text-primary" />
									)}
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => navigate({ to: '/onboard/setup' })}
								className="gap-2 p-2 cursor-pointer"
							>
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<PlusIcon className="size-4 text-primary" />
								</div>
								<div className="font-medium text-foreground">Buat Tim Baru</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => navigate({ to: '/onboard/join' })}
								className="gap-2 p-2 cursor-pointer"
							>
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<UserPlusIcon className="size-4 text-primary" />
								</div>
								<div className="font-medium text-foreground">Gabung Tim Lain</div>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
