import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useSearchParams } from '@remix-run/react'
import { z } from 'zod'
import { validateRequest } from '#app/utils/verify.server'
import { Field } from '#app/components/forms'
import { Button } from '#app/components/ui/button'

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
    <div className="mx-auto flex max-w-md flex-col space-y-6 w-full">
      <div className="flex flex-col space-y-3 w-full">
        <h1 className="font-heading text-5xl font-extrabold">Verify your email</h1>
        <p className="text-base text-secondary-foreground">Check your email for an OTP</p>
      </div>
      <Form
        method="post"
        className="flex flex-col w-full"
        {...getFormProps(form)}
      >
        <Field
          inputProps={{
            ...getInputProps(fields[codeQueryParam], { type: 'text' }),
            autoComplete: 'one-time-code',
            className: "h-16 text-lg placeholder:text-muted",
            placeholder: "Enter OTP"
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
        <Button type='submit' className="h-16 text-xl font-medium">Submit</Button>
      </Form>
    </div>
  )
}
