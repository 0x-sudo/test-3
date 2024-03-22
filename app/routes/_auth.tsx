import { Outlet } from '@remix-run/react'
import { MainNav } from './_index'

export default function AuthLayout() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col p-4 lg:p-6 w-full h-screen items-center justify-center">
      <MainNav />
      <Outlet />
    </div>
  )
}
