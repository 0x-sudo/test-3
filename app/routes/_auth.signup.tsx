import { Input } from "#app/components/ui/input.js";
import { Form, Link } from "@remix-run/react";

export default function SignupRoute() {
  return (
    <div>
      <Link
        to="/"
        className="text-sm bg-zinc-800 px-4 py-2 absolute bottom-4 right-4 shadow-md rounded-lg"
      >
        Home
      </Link>
      <h1 className="font-cal text-5xl">Signup Route</h1>
      <Form className="my-8 max-w-sm flex flex-col w-full space-y-3">
        <Input id="email" placeholder="name@example.com" type="email" />
        <button
          type="submit"
          className="bg-zinc-700 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium h-10 w-full rounded-md focus-visible:ring-[2px] dark:focus:outline-none dark:focus:ring-neutral-600"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}
