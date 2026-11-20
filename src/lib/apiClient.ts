import axios from 'axios'

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
	withCredentials: true
})

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token')
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			const url = error.config?.url || ''
			const isAuthEndpoint =
				url.includes('/auth/login') || url.includes('/auth/register')
			if (!isAuthEndpoint) {
				localStorage.removeItem('auth_token')
				localStorage.removeItem('auth_user')
			}
		}
		return Promise.reject(error)
	}
)
