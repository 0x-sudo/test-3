import { redirect } from '@remix-run/node'
import { authSessionStorage } from './session.server'
import { db } from './db.server'
import { sessionTable, userTable } from './schema'
import { eq } from 'drizzle-orm'

export const sessionKey = 'sessionId'

export async function getUserId(request: Request) {
	const authSession = await authSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const sessionId = authSession.get(sessionKey)
	if (!sessionId) return null

	const session = await db
		.select({
			user: userTable.id,
		})
		.from(sessionTable)
		.leftJoin(userTable, eq(sessionTable.userId, userTable.id))
		.then(s => s[0])

	if (!session?.user) {
		throw redirect('/', {
			headers: {
				'set-cookie': await authSessionStorage.destroySession(authSession),
			},
		})
	}
	return session.user
}

export async function requireAnonymous(request: Request) {
	const userId = await getUserId(request)
	if (userId) {
		throw redirect('/')
	}
}
