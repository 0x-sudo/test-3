import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const main = () => {
  try {
    console.time("✅ Migrations Completed");
    const sqlite = new Database(process.env.DATABASE_URL!);
    const db = drizzle(sqlite);
    migrate(db, { migrationsFolder: "./app/utils/migrations" });
    sqlite.close();
    console.timeEnd("✅ Migrations Completed");
    process.exit(0);
  } catch (err) {
    console.error("🔴 Error Migrating", err);
    process.exit(1);
  }
};

main();
