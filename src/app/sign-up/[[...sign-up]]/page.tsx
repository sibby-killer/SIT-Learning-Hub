import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";

import { SetupRequired } from "@/components/auth/setup-required";
import { isClerkConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Create account",
};

export const instant = false;

export default function SignUpPage() {
  if (!isClerkConfigured) {
    return (
      <SetupRequired
        title="Sign-up is not configured yet"
        description="Clerk is the identity provider for this platform. Once the keys are set, this page will render the real account creation flow."
      />
    );
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Loading sign-up...</p>
        }
      >
        <SignUp />
      </Suspense>
    </main>
  );
}
