import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="max-w-4xl mx-auto p-6 w-full h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
}
