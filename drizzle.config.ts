import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/utils/schema/**/*",
  out: "./migrations",
  driver: "d1",
});
