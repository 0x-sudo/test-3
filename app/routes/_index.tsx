import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:px-0 w-full h-screen">
      <Link to="/signup" className="text-xs bg-zinc-800 px-4 text-zinc-300 py-2 absolute bottom-4 right-4 shadow-md rounded-lg">Signup</Link>
      <h1 className="font-cal text-5xl">Cosmos</h1>
    </div>
  );
}
