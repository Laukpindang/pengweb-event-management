import { RouterProvider } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './auth'
import { useAuth } from './lib/useAuth'
import { getRouter } from './router'

const rootElement = document.getElementById('app')

if (!rootElement) {
	throw new Error('Failed to find the root element')
}

const router = getRouter()

function App() {
	const auth = useAuth()
	return <RouterProvider router={router} context={{ auth }} />
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<AuthProvider>
			<App />
		</AuthProvider>
	)
}
