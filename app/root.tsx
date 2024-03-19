import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useNavigate,
} from '@remix-run/react'
import './styles/fonts.css'
import './styles/globals.css'
import { RouterProvider } from 'react-aria-components'

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="font-sans">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	const navigate = useNavigate()
	return (
		<RouterProvider navigate={navigate}>
			<Outlet />
		</RouterProvider>
	)
}
