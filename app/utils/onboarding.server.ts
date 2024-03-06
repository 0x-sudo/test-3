import { onboardingEmailSessionKey } from "#app/routes/_auth.onboarding";
import { redirect } from "@remix-run/node";
import { verifySessionStorage } from "./verification.server";
import { VerifyFunctionArgs } from "./verify.server";
import { invariant } from '@epic-web/invariant'

export async function handleVerification({ submission }: VerifyFunctionArgs) {
  invariant(submission.status === 'success', 'Submission should be successful by now')
  const verifySession = await verifySessionStorage.getSession()
  verifySession.set(onboardingEmailSessionKey, submission.value.target)
  return redirect("/onboarding", {
    headers: {
      "set-cookie": await verifySessionStorage.commitSession(verifySession)
    }
  })
}
