import { Icon } from '#app/components/ui/icon.js'
import { Link } from '@remix-run/react'

export default function Index() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col p-4 lg:p-6 h-screen w-full">
      <MainNav />
      <h1 className="text-4xl font-bold">Hello World</h1>
    </div>
  )
}

export const MainNav = () => {
  return (
    <div className='w-full flex items-center space-x-4 justify-center absolute top-6 mx-auto inset-x-0'>
      <Link to="/" className='bg-secondary p-2'>
        <Icon name='camp' className='w-10 h-10 text-secondary-foreground' />
      </Link>
      <Link to="/signup" className='bg-secondary p-2'>
        <Icon name='user' className='w-10 h-10 text-secondary-foreground' />
      </Link>
    </div>
  )
}
