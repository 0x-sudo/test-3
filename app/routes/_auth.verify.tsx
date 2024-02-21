import { generateTOTP } from "@epic-web/totp";
import { z } from "zod";
import { getDomainUrl } from "~/utils/misc";
import { VerificationType } from "~/utils/schema";

export const codeQueryParam = "code";
export const targetQueryParam = "target";
export const typeQueryParam = "type";
export const redirectToQueryParam = "redirectTo";
const types = ["onboarding", "reset-password", "change-email", "2fa"] as const;
const VerificationTypeSchema = z.enum(types);
export type VerificationTypes = z.infer<typeof VerificationTypeSchema>;

export function getRedirectToUrl({
  request,
  type,
  target,
  redirectTo,
}: {
  request: Request;
  type: VerificationTypes;
  target: string;
  redirectTo?: string;
}) {
  const redirectToUrl = new URL(`${getDomainUrl(request)}/verify`);
  redirectToUrl.searchParams.set(typeQueryParam, type);
  redirectToUrl.searchParams.set(targetQueryParam, target);
  if (redirectTo) {
    redirectToUrl.searchParams.set(redirectToQueryParam, redirectTo);
  }
  return redirectToUrl;
}

export async function prepareVerification({
  request,
  period,
  type,
  target,
}: {
  request: Request;
  period: number;
  type: VerificationTypes;
  target: string;
}) {
  const verifyUrl = getRedirectToUrl({ request, type, target });
  const redirectTo = new URL(verifyUrl.toString());

  const { otp, ...verificationConfig } = generateTOTP({
    algorithm: "SHA256",
    charSet: "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789",
    period,
  });

  const verificationData: VerificationType = {
    type,
    target,
    ...verificationConfig,
    expiresAt: new Date(
      Date.now() + verificationConfig.period * 1000
    ).toString(),
  };

  verifyUrl.searchParams.set(codeQueryParam, otp);

  return { otp, redirectTo, verifyUrl, verificationData };
}

export default function VerifyRoute() {
  return <div>verify</div>;
}
