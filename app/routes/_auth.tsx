import { Outlet } from '@remix-run/react'
import { MainNav } from './_index'

export default function AuthLayout() {
	return (
		<div className="mx-auto flex h-screen w-full max-w-4xl flex-col items-center justify-center p-4 lg:p-6">
			<MainNav />
			<Outlet />
		</div>
	)
}
