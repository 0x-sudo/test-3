import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import tailwindStyleSheetUrl from './styles/tailwind.css?url'
import fontStyleSheetUrl from './styles/fonts.css?url'
import { LinksFunction } from '@remix-run/node'
import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Comsos' },
		{ name: 'description', content: 'Trying out Remix!' },
	]
}

export const links: LinksFunction = () => {
	return [
		// Preload CSS as a resource to avoid render blocking
		{ rel: 'preload', href: tailwindStyleSheetUrl, as: 'style' },
		{ rel: 'preload', href: fontStyleSheetUrl, as: 'style' },
		//These should match the css preloads above to avoid css as render blocking resource
		{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
		{ rel: 'stylesheet', href: fontStyleSheetUrl },
	].filter(Boolean)
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="bg-zinc-900 font-sans text-white">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}
