import { Button } from '#app/components/ui/button.js'
import { Input } from '#app/components/ui/input.js'
import { Form } from '@remix-run/react'
import { TextField } from 'react-aria-components'

export default function SignupRoute() {
	return (
		<div className="flex w-full flex-col items-center space-y-6">
			<h1 className="text-4xl font-extrabold">Create a new account</h1>
			<Form className="mx-auto flex w-full max-w-md flex-col space-y-4">
				<TextField aria-label="Email">
					<Input type="email" placeholder="name@example.com" />
				</TextField>
				<Button className="h-12 font-medium">Submit</Button>
			</Form>
		</div>
	)
}
