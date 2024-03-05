import { getDomainUrl } from "#app/utils/misc";
import {
  VerificationTypes,
  codeQueryParam,
  redirectToQueryParam,
  targetQueryParam,
  typeQueryParam,
} from "./_auth.verify";
import { generateTOTP } from "#app/utils/totp.server";
import { db } from "#app/utils/db.server";
import { VerificationTableType, verificationTable } from "#app/utils/schema";
import { sql } from "drizzle-orm";

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
  period,
  request,
  type,
  target,
}: {
  period: number;
  request: Request;
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

  const verificationData: VerificationTableType = {
    type,
    target,
    ...verificationConfig,
    expiresAt: new Date(Date.now() + verificationConfig.period * 1000),
  };

  await db
    .insert(verificationTable)
    .values(verificationData)
    .onConflictDoUpdate({
      set: verificationData,
      target: verificationTable.id,
      where: sql`${verificationTable.target} =  ${verificationData.target} AND ${verificationTable.type} = ${verificationData.type}`,
    });

  // add the otp to the url we'll email the user.
  verifyUrl.searchParams.set(codeQueryParam, otp);

  return { otp, redirectTo, verifyUrl };
}
