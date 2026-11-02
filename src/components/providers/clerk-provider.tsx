import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

import { isClerkConfigured } from "@/lib/env";

export function AppClerkProvider({ children }: { children: ReactNode }) {
  if (!isClerkConfigured) {
    return children;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#0f5c5b",
          colorBackground: "#fffdf8",
          borderRadius: "0.625rem",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
