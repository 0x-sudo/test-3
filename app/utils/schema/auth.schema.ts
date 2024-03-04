import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId as cuid } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";

export const userTable = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

export const passwordTable = sqliteTable("password", {
  hash: text("hash").notNull(),
  userId: text("user_id").notNull().references(() => userTable.id)
})
