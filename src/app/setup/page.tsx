import {
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSetupStatus } from "@/lib/setup";

export const metadata = {
  title: "Setup status",
};

export default function SetupPage() {
  const setup = getSetupStatus();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/80">
        <div className="mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <Link
            href="/"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Back home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <Badge variant="outline">Setup status</Badge>
          <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            What is configured, and what is still missing.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            This page reads the environment at request time and never displays
            secret values. A count of {setup.configuredCount}/{setup.totalCount}
            {" "}items is configured.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {setup.items.map((item) => (
            <Card key={item.key}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  {item.configured ? (
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <CircleDashed
                      className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                  <div>
                    <h2 className="font-medium text-foreground">{item.label}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  {item.configured ? "Review" : "Configure"}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-amber-200 bg-amber-50/70">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-900">
              <ShieldAlert className="size-5" aria-hidden="true" />
              <CardTitle className="text-base">Do not paste keys here</CardTitle>
            </div>
            <CardDescription className="text-amber-900/80">
              Put values in <code>.env.local</code> only. This page and the
              health endpoint report presence, not values.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className={buttonVariants()}>
            Open student preview
          </Link>
          <Link href="/admin" className={buttonVariants({ variant: "outline" })}>
            Open admin preview
          </Link>
        </div>
      </main>
    </div>
  );
}
