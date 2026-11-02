import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb, isDatabaseConfigured } from "@/db/client";
import { users, type User } from "@/db/schema";
import { isAdminEmail, isClerkConfigured } from "@/lib/env";
import { type AppRole, type Permission, hasPermission } from "@/lib/permissions";

export async function getCurrentUser(): Promise<User | null> {
  if (!isClerkConfigured || !isDatabaseConfigured) {
    return null;
  }

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const db = getDb();
  const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    `${userId}@clerk.local`;

  const fullName =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
    clerkUser.username ||
    null;

  const role: AppRole = isAdminEmail(email) ? "admin" : "student";

  await db
    .insert(users)
    .values({
      id: userId,
      email,
      fullName,
      imageUrl: clerkUser.imageUrl || null,
      role,
    })
    .onConflictDoNothing();

  const created = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  return created[0] ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();

  if (!hasPermission(user.role, permission)) {
    redirect("/dashboard?error=forbidden");
  }

  return user;
}
