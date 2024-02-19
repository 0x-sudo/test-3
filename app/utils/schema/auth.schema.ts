import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId as cuid } from "@paralleldrive/cuid2";

export const userTable = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => cuid()),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  name: text("name"),
  createdAt: text("created_at").$defaultFn(() => new Date().toUTCString()),
  updatedAt: text("updated_at").$defaultFn(() => new Date().toUTCString()),
});

export const passwordTable = sqliteTable("password", {
  hash: text("hash"),
  userId: text("user_id")
    .unique()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});
