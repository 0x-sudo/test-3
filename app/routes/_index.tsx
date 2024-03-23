import { Icon } from '#app/components/ui/icon.js'
import { Link } from '@remix-run/react'

export default function Index() {
	return (
		<div className="mx-auto flex h-screen w-full max-w-4xl flex-col items-center justify-center p-4 lg:p-6">
			<MainNav />
			<h1 className="text-4xl font-bold">Hello World</h1>
		</div>
	)
}

export const MainNav = () => {
	return (
		<div className="absolute inset-x-0 top-6 mx-auto flex w-full items-center justify-center space-x-4">
			<Link to="/" className="bg-secondary p-2">
				<Icon name="camp" className="h-8 w-8 text-secondary-foreground" />
			</Link>
			<Link to="/signup" className="bg-secondary p-2">
				<Icon name="user" className="h-8 w-8 text-secondary-foreground" />
			</Link>
		</div>
	)
}
