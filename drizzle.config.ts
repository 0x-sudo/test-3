import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/utils/schema**/*",
  out: "./migrations",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
