import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { createId as cuid } from '@paralleldrive/cuid2'
import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm'

export const userTable = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => cuid()),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
})

export type User = InferSelectModel<typeof userTable>

export const passwordTable = sqliteTable('password', {
  hash: text('hash').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
})

export const verificationTable = sqliteTable(
  'verification',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => cuid()),
    createdAt: integer('created_at', {
      mode: 'timestamp',
    }).default(sql`CURRENT_TIMESTAMP`),
    type: text('type').notNull(),
    target: text('target').notNull(),
    secret: text('secret').notNull(),
    algorithm: text('algorithm').notNull(),
    digits: integer('digits').notNull(),
    period: integer('period').notNull(),
    charSet: text('charset').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }),
  },
  table => {
    return {
      typeTargetIdx: uniqueIndex('type_target_idx').on(
        table.type,
        table.target,
      ),
    }
  },
)

export type VerificationTableType = InferInsertModel<typeof verificationTable>

export const sessionTable = sqliteTable(
  'session',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => cuid()),
    expirationDate: integer('expiration_date', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
  },
  table => {
    return {
      useridIdx: index('userid_idx').on(table.userId),
    }
  },
)
