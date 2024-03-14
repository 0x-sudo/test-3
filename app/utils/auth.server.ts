import { redirect } from '@remix-run/node'
import { authSessionStorage } from './session.server'
import { db } from './db.server'
import bcrypt from 'bcryptjs'
import { User, passwordTable, sessionTable, userTable } from './schema'
import { eq } from 'drizzle-orm'

export const sessionKey = 'sessionId'

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () => new Date(Date.now() + SESSION_EXPIRATION_TIME)

export async function getPasswordHash(password: string) {
  const hash = await bcrypt.hash(password, 10)
  return hash
}

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

export async function signup({ email, name, username, password }: { email: User['email'], username: User['username'], name: User['name'], password: string }) {
  const hashedPassword = await getPasswordHash(password)
  const newUser = await db.insert(userTable).values({
    username: username.toLowerCase(),
    name: name,
    email: email.toLowerCase()
  }).returning().then(s => s[0])

  await db.insert(passwordTable).values({
    hash: hashedPassword,
    userId: newUser.id,
  })
  const session = await db.insert(sessionTable).values({
    expirationDate: getSessionExpirationDate(),
    userId: newUser.id
  }).returning({
    userId: sessionTable.userId,
    expirationTime: sessionTable.expirationDate
  })

  return session
}
