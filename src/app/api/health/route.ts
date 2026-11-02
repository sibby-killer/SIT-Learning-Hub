import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb, isDatabaseConfigured } from "@/db/client";
import { isAiConfigured, isClerkConfigured } from "@/lib/env";

async function databaseStatus() {
  if (!isDatabaseConfigured()) {
    return "not_configured";
  }

  try {
    await getDb().run(sql`select 1`);
    return "ok";
  } catch {
    return "error";
  }
}

export async function GET() {
  const database = await databaseStatus();
  const checks = {
    app: "ok",
    database,
    clerk: isClerkConfigured ? "configured" : "not_configured",
    ai: isAiConfigured ? "configured" : "not_configured",
  };

  const ok = database !== "error";

  return NextResponse.json(
    {
      status: ok ? "ok" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 },
  );
}
