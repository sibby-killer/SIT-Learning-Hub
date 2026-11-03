import { BookOpen, Clock, Target } from "lucide-react";
import { connection } from "next/server";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listPublishedCurriculum } from "@/lib/curriculum";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Learning" };
export const instant = false;

export default async function LearningPage() {
  await connection();
  let published: Awaited<ReturnType<typeof listPublishedCurriculum>> = [];
  let loadError: string | null = null;

  if (isDatabaseConfigured) {
    try {
      published = await listPublishedCurriculum();
    } catch (error) {
      loadError =
        error instanceof Error
          ? error.message
          : "Published curriculum could not be loaded.";
    }
  }

  const groups = new Map<string, typeof published>();

  for (const unit of published) {
    const key = `${unit.programmeCode} · ${unit.academicYearLabel} · ${unit.semesterLabel}`;
    const list = groups.get(key) ?? [];
    list.push(unit);
    groups.set(key, list);
  }

  return (
    <AppShell
      title="Learning"
      description="Only verified, published curriculum appears here. Draft, archived, and unverified units stay in the admin workspace."
      active="/learning"
    >
      <div className="space-y-6">
        {loadError ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {loadError}
          </div>
        ) : null}

        {published.length === 0 ? (
          <Card>
            <CardHeader>
              <Badge variant="warning">No published units</Badge>
              <CardTitle className="mt-2">
                The catalog is empty because nothing has been verified and
                published yet.
              </CardTitle>
              <CardDescription>
                This is deliberate. Seeded MMUST units are unverified drafts and
                remain visible only to administrators. An administrator must
                verify the programme and unit, then publish the programme,
                academic year, semester, and unit before a student can see it.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              The topic learning screen, resources, and personal notes arrive in
              Phase 3.
            </CardContent>
          </Card>
        ) : null}

        {[...groups.entries()].map(([label, units]) => (
          <section key={label} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif text-2xl font-semibold">{label}</h2>
              <Badge variant="outline">{units.length} units</Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {units.map((unit) => (
                <Card key={unit.id}>
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="success">Published</Badge>
                      <Badge variant="outline">{unit.credits} credits</Badge>
                    </div>
                    <CardTitle className="mt-2">
                      {unit.code} · {unit.title}
                    </CardTitle>
                    <CardDescription>
                      {unit.programmeTitle} · {unit.institutionName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {unit.description ? (
                      <p className="text-sm leading-6 text-muted-foreground">
                        {unit.description}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Target className="size-3.5" aria-hidden="true" />
                        {unit.outcomeCount} outcomes
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="size-3.5" aria-hidden="true" />
                        {unit.topicCount} topics
                      </span>
                      {unit.recommendedHours ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-3.5" aria-hidden="true" />
                          {unit.recommendedHours} recommended hours
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Topic learning opens in Phase 3.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
