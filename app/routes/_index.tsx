import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:px-0">
      <Link
        to="/signup"
        className="bg-zinc-800 text-zinc-300 text-xs font-medium px-4 py-2 absolute bottom-4 right-4 shadow-md"
      >
        Sign up
      </Link>
      <h1>Cosmos</h1>
    </div>
  );
}
