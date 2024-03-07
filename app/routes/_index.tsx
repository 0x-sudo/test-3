import { Icon } from '#app/components/ui/icon'
import { Link } from '@remix-run/react'

export default function Index() {
  return (
    <div className="mx-auto h-screen w-full max-w-4xl p-6 lg:px-0">
      <Link
        to="/signup"
        className="absolute bottom-4 right-4 rounded-full bg-zinc-800 w-12 h-12 flex items-center justify-center text-zinc-300 shadow-md"
      >
        <Icon name='user' size='md' />
      </Link>
      <h1 className="font-cal text-5xl">Cosmos</h1>
    </div>
  )
}
