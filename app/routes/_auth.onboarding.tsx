import { requireAnonymous, sessionKey, signup } from '#app/utils/auth.server'
import { db } from '#app/utils/db.server'
import { userTable } from '#app/utils/schema'
import { authSessionStorage } from '#app/utils/session.server'
import {
  NameSchema,
  PasswordAndConfirmPasswordSchema,
  UsernameSchema,
} from '#app/utils/user-validation'
import { verifySessionStorage } from '#app/utils/verification.server'
import { parseWithZod } from '@conform-to/zod'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { z } from 'zod'

export const onboardingEmailSessionKey = 'onboardingEmail'

export const SignupFormSchema = z
  .object({
    username: UsernameSchema,
    name: NameSchema,
    agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
      required_error:
        'You must agree to the terms of service and privacy policy',
    }),
    remember: z.boolean().optional(),
    redirectTo: z.string().optional(),
  })
  .and(PasswordAndConfirmPasswordSchema)

async function requireOnboardingEmail(request: Request) {
  await requireAnonymous(request)
  const verifySession = await verifySessionStorage.getSession(request.headers.get('cookie'))
  const email = verifySession.get(onboardingEmailSessionKey)
  if (typeof email !== 'string' || !email) {
    throw redirect("/signup")
  }
  return email
}

export async function action({ request }: ActionFunctionArgs) {
  const email = await requireOnboardingEmail(request)
  const formData = await request.formData()

  const submission = await parseWithZod(formData, {
    schema: intent => SignupFormSchema.superRefine(async (data, ctx) => {
      const existingUser = await db.query.userTable.findFirst({
        where: (userTable, { eq }) => eq(userTable.username, data.username),
        columns: {
          id: true
        }
      })
      if (existingUser) {
        ctx.addIssue({
          path: ['username'],
          code: z.ZodIssueCode.custom,
          message: 'A user already exists with this username',
        })
        return
      }
    }).transform(async data => {
      if (intent !== null) return { ...data, session: null }
      const session = await signup({ ...data, email })
      return { ...data, session }
    }),
    async: true,
  })

  if (submission.status !== 'success' || !submission.value.session) {
    return json(
      { result: submission.reply() },
      { status: submission.status === 'error' ? 400 : 200 },
    )
  }

  const { session, remember, redirectTo } = submission.value

  const authSession = await authSessionStorage.getSession(request.headers.get("cookie"))
  authSession.set(sessionKey, session[0].userId)

  const verifySession = await verifySessionStorage.getSession()
  const headers = new Headers()
  headers.append('set-cookie', await authSessionStorage.commitSession(authSession, {
    expires: remember ? session[0].expirationTime : undefined
  }))
  headers.append(
    'set-cookie',
    await verifySessionStorage.destroySession(verifySession),
  )

  return redirect(redirectTo, {
    headers
  })
}
