import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  FlaskConical,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const studentNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learning", label: "Learning", icon: BookOpen },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/exams", label: "Exams", icon: ClipboardCheck },
  { href: "/practical", label: "Practical", icon: FlaskConical },
  { href: "/career", label: "Career", icon: BriefcaseBusiness },
  { href: "/assistant", label: "Agent", icon: Sparkles },
];

const adminNav = [
  { href: "/admin", label: "Overview", icon: ShieldCheck },
  { href: "/admin/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  children,
  title,
  description,
  active = "/dashboard",
  admin = false,
}: {
  children: ReactNode;
  title: string;
  description?: string;
  active?: string;
  admin?: boolean;
}) {
  const nav = admin ? adminNav : studentNav;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <Badge variant="outline">{admin ? "Admin preview" : "Student preview"}</Badge>
            <Link
              href={admin ? "/dashboard" : "/admin"}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {admin ? "Student view" : "Admin view"}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav aria-label={admin ? "Admin navigation" : "Student navigation"} className="sticky top-24 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-8 max-w-3xl">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
