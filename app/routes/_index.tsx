import { Link } from "@remix-run/react"
import { Icon } from "~/components/ui/icon"

export default function Index() {
  return (
    <div className="flex h-screen w-full flex-col p-6 lg:px-0 max-w-4xl mx-auto">
      <div className="flex max-w-sm flex-col">
        <h1 className="mb-3 text-4xl text-primary font-cal">
          Learning about Remix while building Cosmos
        </h1>
      </div>
      <MainNav />
    </div>
  )
}

export const MainNav = () => {
  return (
    <div className="absolute flex space-x-2 bottom-6 left-0 right-0 mx-auto w-fit max-w-md rounded-full border border-border p-2 shadow-md">
      <Link to="/" className="w-fit rounded-full bg-secondary p-3 text-base lg:text-lg  font-medium cursor-pointer">
        <Icon name="home" className="text-secondary-foreground w-6 h-6 lg:w-7 lg:h-7" />
      </Link>
      <Link to="/signup" className="w-fit rounded-full bg-secondary p-3 text-base lg:text-lg font-medium cursor-pointer">
        <Icon name="user" className="text-secondary-foreground w-6 h-6 lg:w-7 lg:h-7" />
      </Link>
    </div>
  )
}
