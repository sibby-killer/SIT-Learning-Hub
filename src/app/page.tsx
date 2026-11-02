import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  ShieldCheck,
  Sparkles,
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

const pillars = [
  {
    title: "Learn the unit",
    description:
      "Structured topics, prerequisites, notes, resources, and a persistent teacher that uses your actual context.",
    icon: BookOpenCheck,
  },
  {
    title: "Prove the outcome",
    description:
      "Assessments with clear rubrics, server-enforced 60% progression, and feedback that explains what to fix.",
    icon: ClipboardCheck,
  },
  {
    title: "Build the evidence",
    description:
      "Practical projects, career skills, and a portfolio grounded in work you can show, not an opaque score.",
    icon: BriefcaseBusiness,
  },
];

export default function HomePage() {
  const setup = getSetupStatus();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Logo />
          <nav className="flex items-center gap-2" aria-label="Primary navigation">
            <Link
              href="/setup"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Setup status
            </Link>
            <Link
              href="/sign-in"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/80">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(15,92,91,0.12),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(196,122,44,0.14),transparent_28%)]"
          />
          <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-5 bg-background/70">
                <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                Phase 1 foundation · preview mode
              </Badge>
              <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                A learning hub that has to prove it works.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                SIT Learning Hub connects verified academic content, practical
                work, and career evidence. No invented curriculum. No fake
                progress. No chatbot pretending to be a teacher.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/setup" className={buttonVariants({ size: "lg" })}>
                  Review setup
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/dashboard"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Open preview
                </Link>
              </div>
              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Phase
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-foreground">1/11</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Verified units
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-foreground">0</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Setup items
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-foreground">
                    {setup.configuredCount}/{setup.totalCount}
                  </dd>
                </div>
              </dl>
            </div>

            <Card className="self-start border-primary/15 bg-card/90 shadow-lg shadow-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="font-serif text-xl">
                      Foundation checklist
                    </CardTitle>
                    <CardDescription>
                      Real status, read from environment configuration.
                    </CardDescription>
                  </div>
                  <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {setup.items.map((item) => (
                  <div key={item.key} className="flex gap-3">
                    <CheckCircle2
                      className={
                        item.configured
                          ? "mt-0.5 size-4 shrink-0 text-emerald-600"
                          : "mt-0.5 size-4 shrink-0 text-muted-foreground/50"
                      }
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t border-border pt-4">
                  <p className="text-xs leading-5 text-muted-foreground">
                    {setup.readyForAuth
                      ? "Authentication and database are ready for live testing."
                      : "Preview mode: add the database and Clerk keys to enable sign-in and persisted progress."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              The learning loop
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Three kinds of progress, kept separate.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Viewing a topic is not passing it. Passing an assessment is not
              mastering a practical skill. The platform will treat each one
              honestly.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <Card key={pillar.title} className="bg-card/70">
                  <CardHeader>
                    <span className="mb-3 grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <CardTitle>{pillar.title}</CardTitle>
                    <CardDescription>{pillar.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="border-y border-border/80 bg-secondary/40">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="size-4 text-accent" aria-hidden="true" />
                The agent is not a chat bubble
              </div>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground">
                Tools, memory, and boundaries.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                The teacher agent will read permitted learner context, retrieve
                approved content, call allowlisted application tools, and
                remember the learning journey across sessions. It will not
                change results, unlock topics, or bypass examination rules.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Turso-backed memory",
                "Allowlisted tools",
                "Server-side permissions",
                "Exam-mode restrictions",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2.5 text-sm text-foreground"
                >
                  <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <FlaskConical className="size-4" aria-hidden="true" />
                Content integrity
              </div>
              <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-foreground">
                Official first. Draft always labelled.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                The PRD unit list is not yet verified. Until MMUST curriculum
                documents and exam-source access are confirmed, the platform
                shows only clearly marked draft or sample content.
              </p>
            </div>
            <Link
              href="/setup"
              className={buttonVariants({ variant: "outline", className: "shrink-0" })}
            >
              See what is missing
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>SIT Learning Hub · Phase 1 foundation · Built for verified learning.</p>
          <div className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/legal/content-sources" className="hover:text-foreground">
              Content sources
            </Link>
            <a
              href="https://github.com/sibby-killer/SIT-Learning-Hub"
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
