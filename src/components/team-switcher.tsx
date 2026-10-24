import { ChevronDownIcon, PlusIcon } from 'lucide-react'
import * as React from 'react'
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

export function TeamSwitcher({
	teams
}: {
	teams: {
		name: string
	}[]
}) {
	const [activeTeam, setActiveTeam] = React.useState(teams[0])
	if (!activeTeam) {
		return null
	}
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={<SidebarMenuButton className="w-fit px-1.5" />}
					>
						<span className="truncate font-medium">{activeTeam.name}</span>
						<ChevronDownIcon className="opacity-50" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-64 rounded-lg"
						align="start"
						side="bottom"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="text-xs text-muted-foreground">
								Teams
							</DropdownMenuLabel>
							{teams.map((team) => (
								<DropdownMenuItem
									key={team.name}
									onClick={() => setActiveTeam(team)}
									className="gap-2 p-2"
								>
									{team.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem className="gap-2 p-2">
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<PlusIcon className="size-4" />
								</div>
								<div className="font-medium text-muted-foreground">
									Add team
								</div>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
