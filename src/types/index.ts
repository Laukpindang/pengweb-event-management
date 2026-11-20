export interface User {
	id: string
	email: string
	name: string
	createdAt?: string
}

export interface Team {
	id: string
	name: string
	description: string
	createdAt?: string
	updatedAt?: string
	role?: 'OWNER' | 'MEMBER'
}

export interface TeamMember {
	id: string
	role: 'OWNER' | 'MEMBER'
	createdAt: string
	user: {
		id: string
		name: string
		email: string
	}
}

export interface Event {
	id: string
	name: string
	description: string
	startTime: string
	endTime: string
	teamId?: string
	createdAt?: string
	updatedAt?: string
}

export type TaskStatus = 'UNASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'

export interface Task {
	id: string
	title: string
	description: string
	dueDate: string
	status: TaskStatus
	eventId: string
	assigneeId?: string | null
	createdAt: string
	updatedAt: string
}

export interface EventTaskStats {
	total: number
	unassigned: number
	inProgress: number
	completed: number
	completionPercentage: number
}

export interface EventStatItem {
	id: string
	name: string
	startTime: string
	endTime: string
	tasks: EventTaskStats
}

export interface TeamStats {
	teamId: string
	teamName: string
	teamDescription: string
	members: number
	events: {
		total: number
		items: EventStatItem[]
	}
}
