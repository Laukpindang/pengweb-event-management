import { createContext, useContext } from 'react'
import type { User } from '../types'

export type { User }

export interface AuthContextType {
	user: User | null
	token: string | null
	isAuthenticated: boolean
	login: (email: string, password: string) => Promise<void>
	register: (name: string, email: string, password: string) => Promise<void>
	logout: () => void
	ensureSession: () => Promise<boolean>
	checkHasTeam: () => Promise<
		| {
				hasTeam: true
				id: string
				teamId: string
		  }
		| {
				hasTeam: false
				id: null
				teamId: null
		  }
	>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth harus digunakan di dalam AuthProvider')
	return ctx
}
