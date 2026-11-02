import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

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
import { requireUser } from "@/lib/auth";
import { isClerkConfigured, isDatabaseConfigured } from "@/lib/env";

export const metadata = {
  title: "Dashboard",
};

const modules = [
  {
    href: "/learning",
    label: "Learning",
    detail: "Units, topics, prerequisites, notes, and progress.",
    icon: BookOpen,
    phase: "Phase 3",
  },
  {
    href: "/exams",
    label: "Assessments",
    detail: "Practice, mock, and final assessments with feedback.",
    icon: ClipboardCheck,
    phase: "Phase 4",
  },
  {
    href: "/calendar",
    label: "Calendar",
    detail: "Personal study plan across your units.",
    icon: CalendarDays,
    phase: "Phase 5",
  },
  {
    href: "/practical",
    label: "Practical work",
    detail: "Projects, milestones, and reviewed evidence.",
    icon: FlaskConical,
    phase: "Phase 7",
  },
];

export default async function DashboardPage() {
  const canUseAuth = isClerkConfigured && isDatabaseConfigured;
  const user = canUseAuth ? await requireUser() : null;

  return (
    <AppShell
      title={user ? `Welcome, ${user.fullName ?? "learner"}.` : "Student dashboard"}
      description="This is the Phase 1 shell. The learning loop, assessments, calendar, practical work, and agent arrive in later phases, each behind its own acceptance gate."
      active="/dashboard"
    >
      <div className="space-y-6">
        {!canUseAuth ? (
          <Card className="border-amber-200 bg-amber-50/70">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="warning">Preview mode</Badge>
                <Badge variant="outline">No student data is stored</Badge>
              </div>
              <CardTitle className="mt-2">Authentication is not live yet</CardTitle>
              <CardDescription className="text-amber-950/75">
                Add the Turso and Clerk keys to enable sign-in, roles, and
                persisted progress. The preview does not bypass later security
                gates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/setup" className={buttonVariants({ variant: "outline" })}>
                Review setup
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Card key={module.href}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <Badge variant="outline">{module.phase}</Badge>
                  </div>
                  <CardTitle className="mt-2">{module.label}</CardTitle>
                  <CardDescription>{module.detail}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={module.href}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    Open preview
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-primary/20 bg-primary text-primary-foreground">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-white/10">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-serif text-xl font-semibold">
                  The teacher agent is a later phase.
                </p>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-primary-foreground/75">
                  It will use your permitted learning context and approved
                  content, with tools and memory. It will not be a generic chat
                  window, and it will not control progression.
                </p>
              </div>
            </div>
            <Link
              href="/assistant"
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              See the plan
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
