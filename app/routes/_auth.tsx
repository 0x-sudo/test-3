import { Outlet } from "@remix-run/react";
import { MainNav } from "./_index";

export default function AuthLayout() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-6 max-w-4xl mx-auto">
      <Outlet />
      <MainNav />
    </div>
  )
}
