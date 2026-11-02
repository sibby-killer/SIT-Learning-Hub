import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  ADMIN_EMAILS: z
    .string()
    .optional()
    .transform((value) =>
      (value ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),
  TURSO_DATABASE_URL: z.string().trim().optional(),
  TURSO_AUTH_TOKEN: z.string().trim().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().trim().optional(),
  CLERK_SECRET_KEY: z.string().trim().optional(),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string().trim().optional(),
  AI_PROVIDER: z.string().trim().default("groq"),
  GROQ_API_KEY: z.string().trim().optional(),
  GROQ_MODEL: z.string().trim().default("groq/openai/gpt-oss-120b"),
  GROQ_FAST_MODEL: z.string().trim().default("groq/openai/gpt-oss-20b"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;

export const isClerkConfigured = Boolean(
  env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && env.CLERK_SECRET_KEY,
);

export const isDatabaseConfigured = Boolean(env.TURSO_DATABASE_URL);

export const isAiConfigured = Boolean(env.GROQ_API_KEY);

export const isAdminEmail = (email: string) =>
  env.ADMIN_EMAILS.includes(email.trim().toLowerCase());
