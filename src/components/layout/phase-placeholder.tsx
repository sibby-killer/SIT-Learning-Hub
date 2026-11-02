import { ArrowRight, CircleDashed } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PhasePlaceholder({
  title,
  description,
  phase,
  active = "/dashboard",
  admin = false,
  children,
}: {
  title: string;
  description: string;
  phase: string;
  active?: string;
  admin?: boolean;
  children?: ReactNode;
}) {
  return (
    <AppShell
      title={title}
      description={description}
      active={active}
      admin={admin}
    >
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="warning">
                <CircleDashed className="size-3" aria-hidden="true" />
                {phase}
              </Badge>
            </div>
            <CardTitle className="mt-2 font-serif text-2xl">
              This screen is intentionally not finished yet.
            </CardTitle>
            <CardDescription>
              Phase 1 establishes the shell, security boundaries, data access,
              and test harness. The learning workflow is built in later phases,
              after the foundation passes its gates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {children}
            <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4">
              <p className="text-sm font-medium text-foreground">
                What exists now
              </p>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-muted-foreground">
                <li>Next.js App Router shell and responsive navigation.</li>
                <li>Environment validation and a secret-free setup status page.</li>
                <li>Phase-gated database schema and audit-ready identity model.</li>
                <li>Health endpoint, tests, and CI checks.</li>
              </ul>
            </div>
            <Link href="/setup" className={buttonVariants({ variant: "outline" })}>
              Review setup status
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle>Build order</CardTitle>
            <CardDescription>
              Each phase is implemented, tested, documented, committed, and
              pushed before the next one starts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              {[
                "Phase 1 - foundation and security",
                "Phase 2 - curriculum management",
                "Phase 3 - learning experience",
                "Phase 4 - assessment engine",
                "Phase 5 - study calendar",
              ].map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-foreground">{item}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
