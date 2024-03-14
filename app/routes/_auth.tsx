import { buttonVariants } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { cn } from '#app/utils/misc'
import { Link, Outlet } from '@remix-run/react'

export default function AuthLayout() {
  return (
    <div className="mx-auto flex h-screen w-full max-w-4xl items-center justify-center p-6 lg:px-0">
      <Link
        to="/"
        className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "absolute bottom-4 right-4 rounded-full h-16 w-16")}
      >
        <Icon name='home' size='xl' />
      </Link>
      <Outlet />
    </div>
  )
}
