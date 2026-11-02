import {
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  Settings,
  ShieldCheck,
  Users,
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
import { requirePermission } from "@/lib/auth";
import { isClerkConfigured, isDatabaseConfigured } from "@/lib/env";

export const metadata = {
  title: "Admin",
};

const tools = [
  {
    href: "/admin/curriculum",
    label: "Curriculum",
    detail: "Programmes, units, outcomes, prerequisites, and publication state.",
    icon: BookOpen,
  },
  {
    href: "/admin/users",
    label: "Users and roles",
    detail: "Student, reviewer, and administrator access. No public admin signup.",
    icon: Users,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    detail: "Progress, assessment, and content-quality signals.",
    icon: ChartNoAxesCombined,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    detail: "Platform configuration, sources, retention, and audit visibility.",
    icon: Settings,
  },
];

export default async function AdminPage() {
  const canUseAuth = isClerkConfigured && isDatabaseConfigured;
  const user = canUseAuth ? await requirePermission("view_admin_area") : null;

  return (
    <AppShell
      title="Administration"
      description="The admin area is role-gated. In preview mode it shows the structure only; no curriculum, user, or exam data is exposed."
      active="/admin"
      admin
    >
      <div className="space-y-6">
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                <ShieldCheck className="size-3" aria-hidden="true" />
                Server-enforced roles
              </Badge>
              {user ? <Badge variant="success">{user.role}</Badge> : null}
            </div>
            <CardTitle className="mt-2 font-serif text-2xl">
              {user ? `Signed in as ${user.fullName ?? user.email}` : "Admin preview"}
            </CardTitle>
            <CardDescription>
              Authorization is checked in services, not just in the navigation.
              The first administrator is bootstrapped through ADMIN_EMAILS.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Card key={tool.href}>
                <CardHeader>
                  <span className="grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <CardTitle className="mt-2">{tool.label}</CardTitle>
                  <CardDescription>{tool.detail}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={tool.href}
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
      </div>
    </AppShell>
  );
}
