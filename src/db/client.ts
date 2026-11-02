import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import * as schema from "./schema";

let client: Client | undefined;
let database: ReturnType<typeof createDatabase> | undefined;

function createDatabase() {
  const url = process.env.TURSO_DATABASE_URL;

  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. Add it to .env.local or use file:./.data/local.db for local development.",
    );
  }

  if (url.startsWith("file:")) {
    const filePath = url.slice("file:".length);
    mkdirSync(dirname(filePath), { recursive: true });
  }

  client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });

  return drizzle(client, { schema });
}

export function getDb() {
  if (!database) {
    database = createDatabase();
  }

  return database;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL);
}

export async function closeDb() {
  await client?.close();
  client = undefined;
  database = undefined;
}
