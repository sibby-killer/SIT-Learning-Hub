import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { getDb, isDatabaseConfigured } from "@/db/client";
import { users } from "@/db/schema";
import { isAdminEmail } from "@/lib/env";

type ClerkUserData = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  primary_email_address_id: string | null;
  email_addresses: Array<{ id: string; email_address: string }>;
};

function primaryEmail(data: ClerkUserData) {
  const primary = data.email_addresses.find(
    (email) => email.id === data.primary_email_address_id,
  );

  return primary?.email_address ?? data.email_addresses[0]?.email_address ?? null;
}

function fullName(data: ClerkUserData) {
  return [data.first_name, data.last_name].filter(Boolean).join(" ").trim() || null;
}

export async function POST(request: NextRequest) {
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return new Response("Webhook is not configured", { status: 503 });
  }

  if (!isDatabaseConfigured()) {
    return new Response("Database is not configured", { status: 503 });
  }

  let event;

  try {
    event = await verifyWebhook(request);
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const db = getDb();

  if (event.type === "user.created") {
    const data = event.data as ClerkUserData;
    const email = primaryEmail(data);

    if (!email) {
      return new Response("User has no email address", { status: 422 });
    }

    await db
      .insert(users)
      .values({
        id: data.id,
        email,
        fullName: fullName(data),
        imageUrl: data.image_url || null,
        role: isAdminEmail(email) ? "admin" : "student",
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email,
          fullName: fullName(data),
          imageUrl: data.image_url || null,
          updatedAt: new Date(),
        },
      });
  }

  if (event.type === "user.updated") {
    const data = event.data as ClerkUserData;
    const email = primaryEmail(data);

    if (!email) {
      return new Response("User has no email address", { status: 422 });
    }

    await db
      .update(users)
      .set({
        email,
        fullName: fullName(data),
        imageUrl: data.image_url || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.id));
  }

  if (event.type === "user.deleted") {
    const data = event.data as { id?: string };

    if (data.id) {
      await db.delete(users).where(eq(users.id, data.id));
    }
  }

  return new Response("ok", { status: 200 });
}
