import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useSearchParams } from '@remix-run/react'
import { z } from 'zod'
import { validateRequest } from '#app/utils/verify.server'
import { Field } from '#app/components/forms'

export const codeQueryParam = 'code'
export const targetQueryParam = 'target'
export const typeQueryParam = 'type'
export const redirectToQueryParam = 'redirectTo'
const types = ['onboarding', 'reset-password', 'change-email', '2fa'] as const
const VerificationTypeSchema = z.enum(types)
export type VerificationTypes = z.infer<typeof VerificationTypeSchema>

export const VerifySchema = z.object({
	[codeQueryParam]: z.string().min(6).max(6),
	[typeQueryParam]: VerificationTypeSchema,
	[targetQueryParam]: z.string(),
	[redirectToQueryParam]: z.string().optional(),
})

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	return validateRequest(request, formData)
}

export default function VerifyRoute() {
	const [searchParams] = useSearchParams()
	const actionData = useActionData<typeof action>()

	const parseWithZoddType = VerificationTypeSchema.safeParse(
		searchParams.get(typeQueryParam),
	)
	const type = parseWithZoddType.success ? parseWithZoddType.data : null

	const [form, fields] = useForm({
		id: 'verify-form',
		constraint: getZodConstraint(VerifySchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: VerifySchema })
		},
		defaultValue: {
			code: searchParams.get(codeQueryParam),
			type: type,
			target: searchParams.get(targetQueryParam),
			redirectTo: searchParams.get(redirectToQueryParam),
		},
	})

	return (
		<div className="mx-auto flex max-w-sm flex-col space-y-6">
			<div className="flex flex-col space-y-2">
				<h1 className="text-3xl font-bold">Verify your email</h1>
				<p className="text-sm text-zinc-400">Check your email for an OTP</p>
			</div>
			<Form
				method="post"
				className="flex flex-col space-y-3"
				{...getFormProps(form)}
			>
				<Field
					inputProps={{
						...getInputProps(fields[codeQueryParam], { type: 'text' }),
						autoComplete: 'one-time-code',
					}}
					errors={fields[codeQueryParam].errors}
				/>
				<input {...getInputProps(fields[typeQueryParam], { type: 'hidden' })} />
				<input
					{...getInputProps(fields[targetQueryParam], { type: 'hidden' })}
				/>
				<input
					{...getInputProps(fields[redirectToQueryParam], {
						type: 'hidden',
					})}
				/>
				<button
					type="submit"
					className="h-10 w-full rounded-md bg-zinc-700 text-sm text-white shadow-md focus-visible:ring-[2px] dark:bg-zinc-800 dark:focus:outline-none dark:focus:ring-neutral-600"
				>
					Submit
				</button>
			</Form>
		</div>
	)
}
