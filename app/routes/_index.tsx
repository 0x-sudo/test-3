import { buttonVariants } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import { cn } from '#app/utils/misc'
import { Link } from '@remix-run/react'

export default function Index() {
  return (
    <div className="mx-auto h-screen w-full max-w-4xl p-6 lg:px-0">
      <Link
        to="/signup"
        className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "absolute bottom-4 right-4 rounded-full h-16 w-16")}
      >
        <Icon name='user' size='xl' />
      </Link>
      <h1 className="font-heading font-extrabold text-5xl">Cosmos</h1>
    </div>
  )
}
