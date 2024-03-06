import { NameSchema, PasswordAndConfirmPasswordSchema, UsernameSchema } from "#app/utils/user-validation"
import { z } from "zod"

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

async function requireOnboardingEmail() {
  // await requireAnonymous(request)
  return null
}

export async function action() {
  await requireOnboardingEmail()
  return null
}
