import { TanStackDevtools } from '@tanstack/react-devtools'
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import type { AuthContextType } from '@/auth'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import appCss from '../styles.css?url'

export interface MyRouteContext {
	auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouteContext>()({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8'
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				title: 'Team Management System'
			}
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss
			}
		]
	}),
	shellComponent: RootDocument,
	errorComponent: ({ error }) => (
		<ThemeProvider>
			<h1>Something went wrong!</h1>
			<pre>
				{error instanceof Error ? error.message : 'An unknown error occurred'}
			</pre>
		</ThemeProvider>
	),
	notFoundComponent: () => (
		<ThemeProvider>
			<h1>404 - Not Found</h1>
		</ThemeProvider>
	)
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<>
			<HeadContent />
			<ThemeProvider>
				<TooltipProvider>{children}</TooltipProvider>
			</ThemeProvider>
			<Toaster />
			<TanStackDevtools
				config={{
					position: 'bottom-right'
				}}
				plugins={[
					{
						name: 'Tanstack Router',
						render: <TanStackRouterDevtoolsPanel />
					}
				]}
			/>
			<Scripts />
		</>
	)
}
