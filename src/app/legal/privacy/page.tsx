import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Privacy notice" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Logo />
      <Badge variant="warning" className="mt-8">
        Draft - not yet in force
      </Badge>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight">
        Privacy notice
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
        <p>
          This is a placeholder for the platform privacy notice. It will be
          finalized before real student data is collected, with attention to
          Kenya&apos;s Data Protection Act 2019, MMUST policy, retention, export,
          deletion, and the visibility of career and portfolio information.
        </p>
        <p>
          Phase 1 does not collect student data in preview mode. Once Clerk and
          Turso are configured, account identifiers and profile details will be
          stored to operate the service.
        </p>
      </div>
      <Link href="/" className={buttonVariants({ variant: "outline", className: "mt-8" })}>
        Back home
      </Link>
    </main>
  );
}
