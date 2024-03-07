import { Icon } from '#app/components/ui/icon'
import { Link, Outlet } from '@remix-run/react'

export default function AuthLayout() {
  return (
    <div className="mx-auto flex h-screen w-full max-w-4xl items-center justify-center p-6 lg:px-0">
      <Link
        to="/"
        className="absolute bottom-4 right-4 rounded-full bg-zinc-800 w-12 h-12 flex items-center justify-center text-zinc-300 shadow-md"
      >
        <Icon name='home' size='md' />
      </Link>
      <Outlet />
    </div>
  )
}
