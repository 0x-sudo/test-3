import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { createId as cuid } from "@paralleldrive/cuid2";
import { InferInsertModel } from "drizzle-orm";

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

export const verificationTable = sqliteTable(
  "verification",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => cuid()),
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toUTCString()),
    type: text("type").notNull(),
    target: text("target").notNull(),
    secret: text("secret").notNull(),
    algorithm: text("algorithm").notNull(),
    digits: integer("digits").notNull(),
    period: integer("period").notNull(),
    charSet: text("charset").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }),
  },
  (table) => {
    return {
      typeTargetIdx: uniqueIndex("type_target_idx").on(
        table.target,
        table.type
      ),
    };
  }
);

export type VerificationType = InferInsertModel<typeof verificationTable>;
