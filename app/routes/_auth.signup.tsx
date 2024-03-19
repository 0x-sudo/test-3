import { MetaFunction } from "@remix-run/node";
import { Form } from "react-aria-components";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const meta: MetaFunction = () => {
  return [
    { title: 'Register | Cosmos' },
    { name: 'description', content: `Create a new account` },
  ]
}

export default function SignupRoute() {
  return (
    <div className="flex flex-col space-y-4 w-full mx-auto max-w-sm">
      <div className="flex w-full flex-col">
        <h1 className="text-4xl text-primary font-cal">
          Create a new account
        </h1>
      </div>
      <Form className="w-full flex flex-col space-y-3">
        <Input placeholder="name@example.com" className="placeholder:text-border" />
        <Button>Submit</Button>
      </Form>
    </div>
  )
}
