import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { serverOnly$ } from "vite-env-only";
import { z } from "zod";
import { db } from "~/utils/db.server";
import { EmailSchema } from "~/utils/user-validation";
import { prepareVerification } from "./_auth.verify";
import { Form } from "@remix-run/react";
import { VerificationType, verificationTable } from "~/utils/schema";

const SignupSchema = z.object({
  email: EmailSchema,
});

const createVerification = async (
  verificationData: VerificationType,
  DB: D1Database
) => {
  await db(DB)
    .insert(verificationTable)
    .values(verificationData)
    .onConflictDoUpdate({
      target: [verificationTable.type, verificationTable.target],
      set: verificationData,
    });
};

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { DB } = context.cloudflare.env;

  const submission = await parseWithZod(formData, {
    schema: SignupSchema.superRefine(async (data, ctx) => {
      const existingUser = serverOnly$(
        await db(DB).query.userTable.findFirst({
          where: (userTable, { eq }) => eq(userTable.email, data.email),
        })
      );

      if (existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "A user already exists with this email",
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

  const { email } = submission.value;

  const { verifyUrl, redirectTo, otp, verificationData } =
    await prepareVerification({
      request,
      type: "onboarding",
      target: email,
      period: 10 * 60,
    });

  // creates a verification entry in the table
  serverOnly$(createVerification(verificationData, DB));

  console.log({
    "Verify URL": verifyUrl,
    "Verification OTP": otp,
  });

  return redirect(redirectTo.toString());
}

export default function Signup() {
  return (
    <div>
      <h1>Signup</h1>
      <Form method="post">
        <input
          type="email"
          name="email"
          required
          placeholder="name@example.com"
          className="bg-transparent text-white border border-zinc-700 p-4"
        />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
