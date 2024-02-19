import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./db";

try {
  console.time("Migration Completed");
  await migrate(db, { migrationsFolder: "./migrations" });
  console.timeEnd("Migration Completed");
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
