import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './app/utils/schema/**/*',
	out: './app/utils/migrations',
	driver: 'better-sqlite',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
})
