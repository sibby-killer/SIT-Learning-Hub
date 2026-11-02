import "server-only";

import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";

import { createTeacherAgent } from "./agents/teacher";

let mastra: Mastra | undefined;

export function isMastraConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.GROQ_API_KEY);
}

export function getMastra() {
  if (mastra) {
    return mastra;
  }

  const url = process.env.TURSO_DATABASE_URL;

  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is required before the Mastra agent can start.",
    );
  }

  const storage = new LibSQLStore({
    id: "sit-learning-hub-mastra",
    url,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });

  const memory = new Memory({ storage });
  const teacher = createTeacherAgent(memory);

  mastra = new Mastra({
    agents: { teacher },
    storage,
    logger: false,
  });

  return mastra;
}
