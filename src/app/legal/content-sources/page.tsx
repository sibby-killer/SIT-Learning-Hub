import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Content sources" };

export default function ContentSourcesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Logo />
      <Badge variant="warning" className="mt-8">
        Source status
      </Badge>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight">
        Content sources and verification
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
        <p>
          MMUST is the primary source for MMUST curriculum and examination
          material. The PRD&apos;s unit list is not verified. Until official
          programme documents and exam-source access are confirmed, content is
          labelled draft or sample.
        </p>
        <p>
          LearnCpp.com is a supplementary programming reference. It is not
          official MMUST material. Its pages are copyrighted, so the platform
          links to them and writes original notes rather than republishing them
          without permission.
        </p>
        <p>
          Full source inventory and access status live in the repository
          documentation. Do not treat a source as approved until it has a
          recorded licence/access decision.
        </p>
      </div>
      <Link href="/" className={buttonVariants({ variant: "outline", className: "mt-8" })}>
        Back home
      </Link>
    </main>
  );
}
