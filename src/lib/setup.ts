import { env, isAiConfigured, isClerkConfigured, isDatabaseConfigured } from "@/lib/env";

export type SetupItem = {
  key: "database" | "clerk" | "groq" | "admin";
  label: string;
  configured: boolean;
  detail: string;
  href: string;
};

export function getSetupStatus() {
  const items: SetupItem[] = [
    {
      key: "database",
      label: "Turso database",
      configured: isDatabaseConfigured,
      detail: isDatabaseConfigured
        ? "Database URL is present."
        : "Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to .env.local.",
      href: "https://app.turso.tech",
    },
    {
      key: "clerk",
      label: "Clerk authentication",
      configured: isClerkConfigured,
      detail: isClerkConfigured
        ? "Publishable and secret keys are present."
        : "Add the Clerk publishable and secret keys to .env.local.",
      href: "https://dashboard.clerk.com",
    },
    {
      key: "groq",
      label: "Groq AI",
      configured: isAiConfigured,
      detail: isAiConfigured
        ? `Key is present. Model: ${env.GROQ_MODEL}.`
        : "Add GROQ_API_KEY to .env.local before Phase 4/9.",
      href: "https://console.groq.com/keys",
    },
    {
      key: "admin",
      label: "First administrator",
      configured: env.ADMIN_EMAILS.length > 0,
      detail:
        env.ADMIN_EMAILS.length > 0
          ? `${env.ADMIN_EMAILS.length} bootstrap admin email(s) configured.`
          : "Set ADMIN_EMAILS to bootstrap the first administrator.",
      href: "/setup",
    },
  ];

  return {
    items,
    configuredCount: items.filter((item) => item.configured).length,
    totalCount: items.length,
    readyForAuth: isDatabaseConfigured && isClerkConfigured,
    readyForAi: isDatabaseConfigured && isAiConfigured,
    appUrl: env.NEXT_PUBLIC_APP_URL,
  };
}
