import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

import { SetupRequired } from "@/components/auth/setup-required";
import { isClerkConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Create account",
};

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
      <SignUp />
    </main>
  );
}
