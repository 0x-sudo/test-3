import { buttonVariants } from "#app/components/ui/button";
import { Link } from "@remix-run/react";

export default function LoginRoute() {
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="font-cal text-4xl">Welcome Back</h1>
      {/* <Form */}
      {/*   className="flex w-full max-w-sm flex-col" */}
      {/*   method="POST" */}
      {/*   {...getFormProps(form)} */}
      {/* > */}
      {/*   <Field */}
      {/*     inputProps={{ */}
      {/*       ...getInputProps(fields.email, { type: 'email' }), */}
      {/*       autoFocus: true, */}
      {/*       autoComplete: 'email', */}
      {/*       placeholder: 'name@example.com', */}
      {/*     }} */}
      {/*     errors={fields.email.errors} */}
      {/*   /> */}
      {/*   <Button type='submit'>Submit</Button> */}
      {/* </Form> */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-secondary-foreground">Or</span>
        </div>
      </div>
      <Link className={buttonVariants({ variant: "secondary" })} to="/signup">Register</Link>
    </div>

  )
}
