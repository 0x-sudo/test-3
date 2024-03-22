import { Input } from '#app/components/ui/input.js'
import { Form } from '@remix-run/react'
import { TextField } from 'react-aria-components'

export default function SignupRoute() {
	return (
		<div className="flex w-full flex-col items-center space-y-6">
			<h1 className="text-4xl font-bold">Create a new account</h1>
			<Form className="mx-auto flex w-full max-w-md flex-col space-y-4">
				<TextField aria-label="Email">
					<Input type="email" placeholder="name@example.com" />
				</TextField>
				{/* <input */}
				{/* 	type="email" */}
				{/* 	name="email" */}
				{/* 	placeholder="name@example.com" */}
				{/* 	className="h-12 w-full border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" */}
				{/* /> */}
				<button
					type="submit"
					className="h-12 w-full bg-primary font-medium text-primary-foreground"
				>
					Submit
				</button>
			</Form>
		</div>
	)
}
