import { db } from "#app/utils/db.server";
import { EmailSchema } from "#app/utils/user-validation";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  ActionFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { prepareVerification } from "#app/utils/verify.server";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { Field } from "#app/components/forms";

const SignupSchema = z.object({
  email: EmailSchema,
});

export const meta: MetaFunction = () => {
  return [
    { title: "Register | Comsos" },
    { name: "description", content: "Create a new account" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    schema: SignupSchema.superRefine(async (data, ctx) => {
      const existingUser = await db.query.userTable.findFirst({
        where: (userTable, { eq }) => eq(userTable.email, data.email),
        columns: {
          id: true,
        },
      });
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
  const { verifyUrl, redirectTo, otp } = await prepareVerification({
    period: 10 * 60,
    request,
    type: "onboarding",
    target: email,
  });

  console.log("Verify URL: ", verifyUrl.toString(), "OTP: ", otp);

  if (redirectTo) {
    return redirect(redirectTo.toString());
  } else {
    return null;
  }
}

export default function SignupRoute() {
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm({
    id: "signup-form",
    constraint: getZodConstraint(SignupSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      const result = parseWithZod(formData, { schema: SignupSchema })
      return result
    },
    shouldRevalidate: 'onBlur'
  })

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="font-cal text-4xl">Create an account</h1>
      <Form
        className="flex flex-col w-full max-w-sm"
        method="POST"
        {...getFormProps(form)}
      >
        <Field
          inputProps={{
            ...getInputProps(fields.email, { type: 'email' }),
            autoFocus: true,
            autoComplete: 'email',
            placeholder: "name@example.com",
          }}
          errors={fields.email.errors}
        />
        <button
          type="submit"
          className="bg-zinc-700 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium h-10 w-full rounded-md focus-visible:ring-[2px] dark:focus:outline-none dark:focus:ring-neutral-600 text-sm shadow-md"
        >
          Submit
        </button>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-900 px-2 text-zinc-600">Or</span>
        </div>
      </div>
      <button
        type="submit"
        className="bg-zinc-700 dark:bg-zinc-800 text-white text-sm h-10 w-full rounded-md focus-visible:ring-[2px] dark:focus:outline-none dark:focus:ring-neutral-600 shadow-md"
      >
        Submit
      </button>
    </div>
  );
}
