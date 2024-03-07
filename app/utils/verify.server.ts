import { getDomainUrl } from '#app/utils/misc'
import {
	VerificationTypes,
	VerifySchema,
	codeQueryParam,
	redirectToQueryParam,
	targetQueryParam,
	typeQueryParam,
} from '#app/routes/_auth.verify'
import { generateTOTP, verifyTOTP } from '#app/utils/totp.server'
import { db } from '#app/utils/db.server'
import { VerificationTableType, verificationTable } from '#app/utils/schema'
import { and, eq, sql } from 'drizzle-orm'
import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'
import { json, redirect } from '@remix-run/node'
import { Submission } from '@conform-to/react'

export type VerifyFunctionArgs = {
	request: Request
	submission: Submission<
		z.input<typeof VerifySchema>,
		string[],
		z.output<typeof VerifySchema>
	>
	body: FormData | URLSearchParams
}

export function getRedirectToUrl({
	request,
	type,
	target,
	redirectTo,
}: {
	request: Request
	type: VerificationTypes
	target: string
	redirectTo?: string
}) {
	const redirectToUrl = new URL(`${getDomainUrl(request)}/verify`)
	redirectToUrl.searchParams.set(typeQueryParam, type)
	redirectToUrl.searchParams.set(targetQueryParam, target)
	if (redirectTo) {
		redirectToUrl.searchParams.set(redirectToQueryParam, redirectTo)
	}
	return redirectToUrl
}

export async function prepareVerification({
	period,
	request,
	type,
	target,
}: {
	period: number
	request: Request
	type: VerificationTypes
	target: string
}) {
	const verifyUrl = getRedirectToUrl({ request, type, target })
	const redirectTo = new URL(verifyUrl.toString())

	const { otp, ...verificationConfig } = generateTOTP({
		algorithm: 'SHA256',
		charSet: 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789',
		period,
	})

	const verificationData: VerificationTableType = {
		type,
		target,
		...verificationConfig,
		expiresAt: new Date(Date.now() + verificationConfig.period * 1000),
	}

	await db
		.insert(verificationTable)
		.values(verificationData)
		.onConflictDoUpdate({
			set: verificationData,
			target: verificationTable.id,
			where: sql`${verificationTable.target} = ${verificationData.target} AND ${verificationTable.type} = ${verificationData.type}`,
		})

	// add the otp to the url we'll email the user.
	verifyUrl.searchParams.set(codeQueryParam, otp)

	return { otp, redirectTo, verifyUrl }
}

export async function isCodeValid({
	code,
	type,
	target,
}: {
	code: string
	type: VerificationTypes
	target: string
}) {
	const verification = await db.query.verificationTable.findFirst({
		where: (verificationTable, { gt, eq, and, or, isNull }) =>
			and(
				and(
					eq(verificationTable.type, type),
					eq(verificationTable.target, target),
				),
				or(
					isNull(verificationTable.expiresAt),
					gt(verificationTable.expiresAt, new Date()),
				),
			),
		columns: {
			algorithm: true,
			secret: true,
			period: true,
			charSet: true,
		},
	})

	if (!verification) return false
	const result = verifyTOTP({
		otp: code,
		...verification,
	})
	if (!result) return false

	return true
}

export async function validateRequest(
	request: Request,
	body: URLSearchParams | FormData,
) {
	const submission = await parseWithZod(body, {
		schema: VerifySchema.superRefine(async (data, ctx) => {
			const codeIsValid = await isCodeValid({
				code: data[codeQueryParam],
				type: data[typeQueryParam],
				target: data[targetQueryParam],
			})
			if (!codeIsValid) {
				ctx.addIssue({
					path: ['code'],
					code: z.ZodIssueCode.custom,
					message: `Invalid code`,
				})
				return
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { value: submissionValue } = submission

	async function deleteVerification() {
		await db
			.delete(verificationTable)
			.where(
				and(
					eq(verificationTable.type, submissionValue[typeQueryParam]),
					eq(verificationTable.target, submissionValue[targetQueryParam]),
				),
			)
	}

	if (submissionValue[typeQueryParam] === 'onboarding') {
		deleteVerification()
		return redirect('/')
	}
	return null
}
