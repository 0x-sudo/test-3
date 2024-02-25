import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/utils/schema/**/*",
  out: "./migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL
  },
  strict: true,
  verbose: true
});
