import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL ?? "file:./.data/local.db",
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  },
  strict: true,
});
