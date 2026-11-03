import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CurriculumStatusBadge,
  VerificationBadge,
} from "@/components/admin/curriculum/curriculum-badges";
import { MappingsPanel } from "@/components/admin/curriculum/mappings-panel";
import { OutcomesPanel } from "@/components/admin/curriculum/outcomes-panel";
import { PrerequisitesPanel } from "@/components/admin/curriculum/prerequisites-panel";
import { StatusControls } from "@/components/admin/curriculum/status-controls";
import { TopicsPanel } from "@/components/admin/curriculum/topics-panel";
import { UnitMetadataForm } from "@/components/admin/curriculum/unit-metadata-form";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requirePermission } from "@/lib/auth";
import { getUnitDetail } from "@/lib/curriculum";
import { isClerkConfigured, isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Curriculum unit" };
export const instant = false;

export default async function CurriculumUnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ unitId: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { unitId } = await params;
  const query = await searchParams;
  const canUseAuth = isClerkConfigured && isDatabaseConfigured;
  const user = canUseAuth ? await requirePermission("manage_curriculum") : null;

  if (!isDatabaseConfigured) {
    return (
      <AppShell
        title="Curriculum unit"
        description="The database is not configured, so this unit cannot be loaded."
        active="/admin/curriculum"
        admin
      >
        <Card>
          <CardHeader>
            <CardTitle>Database not configured</CardTitle>
            <CardDescription>
              Add TURSO_DATABASE_URL to load curriculum records.
            </CardDescription>
          </CardHeader>
        </Card>
      </AppShell>
    );
  }

  const detail = await getUnitDetail(unitId);

  if (!detail) {
    notFound();
  }

  const unit = detail.unit;
  const canEdit = Boolean(user);

  return (
    <AppShell
      title={`${unit.code} · ${unit.title}`}
      description={`${detail.institution.name} · ${detail.programme.code} · ${detail.academicYear.label} · ${detail.semester.label}`}
      active="/admin/curriculum"
      admin
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/curriculum"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to curriculum
          </Link>
          <CurriculumStatusBadge status={unit.status} />
          <VerificationBadge status={unit.verificationStatus} />
          <Badge variant="outline">Version {unit.version}</Badge>
          <Badge variant="secondary">
            <ShieldCheck className="size-3" aria-hidden="true" />
            Audit logged
          </Badge>
        </div>

        {!canUseAuth ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Preview mode: records are read-only until Clerk and Turso are live.
          </div>
        ) : null}

        {query.error ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {query.error}
          </div>
        ) : null}

        {query.ok ? (
          <div
            role="status"
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          >
            {query.ok}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Outcomes", detail.outcomes.length],
            ["Topics", detail.topics.length],
            ["Prerequisites", detail.prerequisites.length],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <UnitMetadataForm detail={detail} canEdit={canEdit} />
          <StatusControls detail={detail} canEdit={canEdit} />
        </div>

        <OutcomesPanel detail={detail} canEdit={canEdit} />
        <TopicsPanel detail={detail} canEdit={canEdit} />
        <PrerequisitesPanel detail={detail} canEdit={canEdit} />
        <MappingsPanel detail={detail} canEdit={canEdit} />
      </div>
    </AppShell>
  );
}
