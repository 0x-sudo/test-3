import { Link, Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:px-0 w-full h-screen flex items-center justify-center">
      <Link
        to="/"
        className="text-xs bg-zinc-800 px-4 py-2 absolute bottom-4 right-4 shadow-md rounded-lg text-zinc-300"
      >
        Home
      </Link>
      <Outlet />
    </div>
  )
}
