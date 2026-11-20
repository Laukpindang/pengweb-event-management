import { isAxiosError } from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { apiClient } from './lib/apiClient'
import { AuthContext } from './lib/useAuth'
import type { Team, User } from './types'

export type { AuthContextType } from './lib/useAuth'

interface AuthResponse {
	user: User
	accessToken: string
	tokenType: string
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(() => {
		const savedUser = localStorage.getItem('auth_user')
		if (savedUser) {
			try {
				return JSON.parse(savedUser) as User
			} catch {
				return null
			}
		}
		return null
	})

	const [token, setToken] = useState<string | null>(() => {
		return localStorage.getItem('auth_token')
	})

	const userRef = useRef<User | null>(user)
	const tokenRef = useRef<string | null>(token)

	useEffect(() => {
		userRef.current = user
	}, [user])

	useEffect(() => {
		tokenRef.current = token
	}, [token])

	const register = useCallback(
		async (name: string, email: string, password: string) => {
			try {
				const { data } = await apiClient.post<AuthResponse>('/auth/register', {
					name,
					email: email.trim().toLowerCase(),
					password
				})
				localStorage.setItem('auth_token', data.accessToken)
				localStorage.setItem('auth_user', JSON.stringify(data.user))
				userRef.current = data.user
				tokenRef.current = data.accessToken
				setUser(data.user)
				setToken(data.accessToken)
			} catch (err) {
				if (isAxiosError(err)) {
					const message =
						(err.response?.data as { message?: string } | undefined)?.message ||
						'Registrasi gagal'
					throw new Error(message)
				}
				throw new Error('Gagal terhubung ke server')
			}
		},
		[]
	)

	const login = useCallback(async (email: string, password: string) => {
		try {
			const { data } = await apiClient.post<AuthResponse>('/auth/login', {
				email: email.trim().toLowerCase(),
				password
			})
			localStorage.setItem('auth_token', data.accessToken)
			localStorage.setItem('auth_user', JSON.stringify(data.user))
			userRef.current = data.user
			tokenRef.current = data.accessToken
			setUser(data.user)
			setToken(data.accessToken)
		} catch (err) {
			if (isAxiosError(err)) {
				const message =
					(err.response?.data as { message?: string } | undefined)?.message ||
					'Email atau password salah'
				throw new Error(message)
			}
			throw new Error('Gagal terhubung ke server')
		}
	}, [])

	const logout = useCallback(() => {
		localStorage.removeItem('auth_token')
		localStorage.removeItem('auth_user')
		userRef.current = null
		tokenRef.current = null
		setUser(null)
		setToken(null)
	}, [])

	const ensureSession = useCallback(async (): Promise<boolean> => {
		const storedToken = localStorage.getItem('auth_token')
		const storedUser = localStorage.getItem('auth_user')

		if (storedToken && storedUser) {
			try {
				const parsed = JSON.parse(storedUser) as User
				if (!userRef.current) {
					userRef.current = parsed
					tokenRef.current = storedToken
					setUser(parsed)
					setToken(storedToken)
				}
				return true
			} catch {
				localStorage.removeItem('auth_token')
				localStorage.removeItem('auth_user')
				return false
			}
		}

		return Boolean(userRef.current && tokenRef.current)
	}, [])

	const checkHasTeam = useCallback(async () => {
		const session = await ensureSession()
		if (!session) {
			return { hasTeam: false, id: null, teamId: null } as const
		}

		try {
			const { data: member } = await apiClient.get<{
				id: string
				team: { id: string }
			} | null>('/teams/has-team')

			if (member?.team?.id) {
				return { hasTeam: true, id: member.id, teamId: member.team.id } as const
			}

			const { data: teams } = await apiClient.get<Team[]>('/teams')
			if (Array.isArray(teams) && teams.length > 0) {
				return { hasTeam: true, id: teams[0].id, teamId: teams[0].id } as const
			}

			return { hasTeam: false, id: null, teamId: null } as const
		} catch (err) {
			console.error('Failed to get teams:', err)
			return { hasTeam: false, id: null, teamId: null } as const
		}
	}, [ensureSession])

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				isAuthenticated: Boolean(user && token),
				login,
				register,
				logout,
				ensureSession,
				checkHasTeam
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
