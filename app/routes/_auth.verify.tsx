import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { generateTOTP, verifyTOTP } from "~/utils/totp.server";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { serverOnly$ } from "vite-env-only";
import { z } from "zod";
import { db } from "~/utils/db.server";
import { getDomainUrl } from "~/utils/misc";
import { VerificationType, verificationTable } from "~/utils/schema";
import { and, eq } from "drizzle-orm";

export const codeQueryParam = "code";
export const targetQueryParam = "target";
export const typeQueryParam = "type";
export const redirectToQueryParam = "redirectTo";
const types = ["onboarding", "reset-password", "change-email", "2fa"] as const;
const VerificationTypeSchema = z.enum(types);
export type VerificationTypes = z.infer<typeof VerificationTypeSchema>;

const VerifySchema = z.object({
  [codeQueryParam]: z.string().min(6).max(6),
  [typeQueryParam]: VerificationTypeSchema,
  [targetQueryParam]: z.string(),
  [redirectToQueryParam]: z.string().optional(),
});

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
  const redirectTo = new URL(verifyUrl.toString())

  const { otp, ...verificationConfig } = serverOnly$(generateTOTP({
    algorithm: "SHA256",
    charSet: "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789",
    period,
  }))!

  const verificationData: VerificationType = {
    type,
    target,
    ...verificationConfig,
    expiresAt: new Date(Date.now() + verificationConfig.period * 1000),
  };

  verifyUrl.searchParams.set(codeQueryParam, otp);

  return { otp, redirectTo, verifyUrl, verificationData };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  return validateRequest(formData);
}

export async function isCodeValid({
  code,
  type,
  target,
}: {
  code: string;
  type: VerificationTypes;
  target: string;
}) {
  const verification = serverOnly$(
    await db.query.verificationTable.findFirst({
      where: (verificationTable, { gt, eq, and, or, isNull }) =>
        and(
          and(
            eq(verificationTable.type, type),
            eq(verificationTable.target, target)
          ),
          or(
            isNull(verificationTable.expiresAt),
            gt(verificationTable.expiresAt, new Date())
          )
        ),
      columns: {
        algorithm: true,
        secret: true,
        period: true,
        charSet: true,
      },
    })
  );
  if (!verification) return false;
  const result = serverOnly$(verifyTOTP({
    otp: code,
    ...verification,
  }));
  if (!result) return false;
  return true;
}

export async function validateRequest(
  body: URLSearchParams | FormData,
) {
  const submission = await parseWithZod(body, {
    schema: VerifySchema.superRefine(async (data, ctx) => {
      const codeIsValid = await isCodeValid({
        code: data[codeQueryParam],
        type: data[typeQueryParam],
        target: data[targetQueryParam],
      });
      if (!codeIsValid) {
        ctx.addIssue({
          path: ["code"],
          code: z.ZodIssueCode.custom,
          message: `Invalid code`,
        });
        return;
      }
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }

  const { value: submissionValue } = submission;

  async function deleteVerification() {
    serverOnly$(await db
      .delete(verificationTable)
      .where(
        and(
          eq(verificationTable.type, submissionValue[typeQueryParam]),
          eq(verificationTable.target, submissionValue[targetQueryParam])
        )
      ));
  }

  if (submissionValue[typeQueryParam] === "onboarding") {
    serverOnly$(deleteVerification());
    return redirect("/")
  }
  return null
}

export default function VerifyRoute() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();

  const parseWithZoddType = VerificationTypeSchema.safeParse(
    searchParams.get(typeQueryParam)
  );
  const type = parseWithZoddType.success ? parseWithZoddType.data : null;

  const [form, fields] = useForm({
    id: "verify-form",
    constraint: getZodConstraint(VerifySchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifySchema });
    },
    defaultValue: {
      code: searchParams.get(codeQueryParam),
      type: type,
      target: searchParams.get(targetQueryParam),
      redirectTo: searchParams.get(redirectToQueryParam),
    },
  });

  return (
    <div className="flex flex-col space-y-6 max-w-sm mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Verify your email</h1>
        <p className="text-zinc-400 text-sm">Check your email for an OTP</p>
      </div>
      <Form
        method="post"
        className="flex flex-col space-y-3"
        {...getFormProps(form)}>
        <input
          type="text"
          name="code"
          required
          placeholder="enter the otp"
          className="bg-transparent text-white border border-zinc-700 p-4 placeholder:text-zinc-600"
        />
        <input {...getInputProps(fields[typeQueryParam], { type: "hidden" })} />
        <input
          {...getInputProps(fields[targetQueryParam], { type: "hidden" })}
        />
        <input
          {...getInputProps(fields[redirectToQueryParam], {
            type: "hidden",
          })}
        />
        <button
          type="submit"
          className="text-sm font-semibold py-4 w-full bg-zinc-700 shadow-md">
          Submit
        </button>
      </Form>
    </div>
  );
}
