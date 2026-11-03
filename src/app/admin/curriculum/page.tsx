import { ArrowRight, BookOpen, Building2, Layers3 } from "lucide-react";
import Link from "next/link";

import {
  CurriculumStatusBadge,
  VerificationBadge,
} from "@/components/admin/curriculum/curriculum-badges";
import { ParentStatusForm } from "@/components/admin/curriculum/parent-status-form";
import { VerificationForm } from "@/components/admin/curriculum/verification-form";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requirePermission } from "@/lib/auth";
import { getCurriculumOverview } from "@/lib/curriculum";
import { isClerkConfigured, isDatabaseConfigured } from "@/lib/env";
import { cn } from "@/lib/utils";

import {
  createAcademicYearAction,
  createInstitutionAction,
  createProgrammeAction,
  createSemesterAction,
  createUnitAction,
} from "./actions";

export const metadata = { title: "Curriculum admin" };
export const instant = false;

type Overview = Awaited<ReturnType<typeof getCurriculumOverview>>;

function EmptyOptions({ children }: { children: string }) {
  return (
    <option value="" disabled>
      {children}
    </option>
  );
}

export default async function AdminCurriculumPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const params = await searchParams;
  const canUseAuth = isClerkConfigured && isDatabaseConfigured;
  const user = canUseAuth ? await requirePermission("manage_curriculum") : null;
  let overview: Overview = [];
  let loadError: string | null = null;

  if (isDatabaseConfigured) {
    try {
      overview = await getCurriculumOverview();
    } catch (error) {
      loadError =
        error instanceof Error
          ? error.message
          : "Curriculum data could not be loaded.";
    }
  }

  const programmeOptions = overview.flatMap((institution) =>
    institution.programmes.map((programme) => ({
      id: programme.id,
      label: `${programme.code} · ${programme.title}`,
    })),
  );
  const yearOptions = overview.flatMap((institution) =>
    institution.programmes.flatMap((programme) =>
      programme.academicYears.map((year) => ({
        id: year.id,
        label: `${programme.code} · ${year.label}`,
      })),
    ),
  );
  const semesterOptions = overview.flatMap((institution) =>
    institution.programmes.flatMap((programme) =>
      programme.academicYears.flatMap((year) =>
        year.semesters.map((semester) => ({
          id: semester.id,
          label: `${programme.code} · ${year.label} · ${semester.label}`,
        })),
      ),
    ),
  );

  const totals = overview.reduce(
    (accumulator, institution) => {
      accumulator.institutions += 1;

      for (const programme of institution.programmes) {
        accumulator.programmes += 1;

        for (const year of programme.academicYears) {
          accumulator.years += 1;

          for (const semester of year.semesters) {
            accumulator.semesters += 1;

            for (const unit of semester.units) {
              accumulator.units += 1;
              if (unit.status === "published") {
                accumulator.published += 1;
              }
              if (unit.verificationStatus === "unverified") {
                accumulator.unverified += 1;
              }
            }
          }
        }
      }

      return accumulator;
    },
    {
      institutions: 0,
      programmes: 0,
      years: 0,
      semesters: 0,
      units: 0,
      published: 0,
      unverified: 0,
    },
  );

  return (
    <AppShell
      title="Curriculum"
      description="Create and manage institutions, programmes, academic years, semesters, units, outcomes, topics, and prerequisites. Nothing reaches the student catalog until every parent record is published and the programme and unit are verified."
      active="/admin/curriculum"
      admin
    >
      <div className="space-y-6">
        {!canUseAuth ? (
          <Card className="border-amber-200 bg-amber-50/70">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="warning">Preview mode</Badge>
                <Badge variant="outline">Read-only</Badge>
              </div>
              <CardTitle className="mt-2">Connect Clerk and Turso to edit</CardTitle>
              <CardDescription className="text-amber-950/75">
                The seeded curriculum is visible below, but write actions stay
                disabled until authentication and the hosted database are live.
                Server-side permission checks run before every mutation.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {params.error ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {params.error}
          </div>
        ) : null}

        {params.ok ? (
          <div
            role="status"
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          >
            {params.ok}
          </div>
        ) : null}

        {loadError ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {loadError}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Institutions", totals.institutions],
            ["Programmes", totals.programmes],
            ["Semesters", totals.semesters],
            ["Units", totals.units],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 font-serif text-3xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="success">{totals.published} published</Badge>
          <Badge variant="outline">{totals.units - totals.published} draft or archived</Badge>
          <Badge variant="warning">{totals.unverified} unverified</Badge>
          {user ? <Badge variant="secondary">{user.role}</Badge> : null}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers3 className="size-5" aria-hidden="true" />
                Curriculum tree
              </CardTitle>
              <CardDescription>
                Draft records are visible to administrators only. Publish parents
                before publishing a unit so students can see it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {overview.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-sm leading-6 text-muted-foreground">
                  No curriculum records yet. Run the seed or create an
                  institution to begin.
                </div>
              ) : null}

              {overview.map((institution) => (
                <section key={institution.id} className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Building2 className="size-4 text-primary" aria-hidden="true" />
                    <h2 className="font-semibold">{institution.name}</h2>
                    <Badge variant="outline">{institution.country}</Badge>
                  </div>

                  {institution.programmes.length === 0 ? (
                    <p className="pl-6 text-sm text-muted-foreground">
                      No programmes.
                    </p>
                  ) : null}

                  {institution.programmes.map((programme) => (
                    <div
                      key={programme.id}
                      className="ml-2 space-y-3 border-l border-border pl-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <BookOpen className="size-4 text-muted-foreground" aria-hidden="true" />
                        <span className="font-medium">
                          {programme.code} · {programme.title}
                        </span>
                        <CurriculumStatusBadge status={programme.status} />
                        <VerificationBadge status={programme.verificationStatus} />
                        <ParentStatusForm
                          entityType="programme"
                          entityId={programme.id}
                          status={programme.status}
                          canEdit={Boolean(user)}
                        />
                        <VerificationForm
                          entityType="programme"
                          entityId={programme.id}
                          verificationStatus={programme.verificationStatus}
                          canEdit={Boolean(user)}
                          returnTo="/admin/curriculum"
                        />
                      </div>

                      {programme.academicYears.map((year) => (
                        <div key={year.id} className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-medium">{year.label}</span>
                            <CurriculumStatusBadge status={year.status} />
                            {year.isCurrent ? (
                              <Badge variant="outline">Current</Badge>
                            ) : null}
                            <ParentStatusForm
                              entityType="academic_year"
                              entityId={year.id}
                              status={year.status}
                              canEdit={Boolean(user)}
                            />
                          </div>

                          {year.semesters.map((semester) => (
                            <div
                              key={semester.id}
                              className={cn(
                                "rounded-lg border border-border/80 bg-muted/20 p-3",
                                semester.status === "archived" && "opacity-70",
                              )}
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium">
                                  {semester.label}
                                </span>
                                <CurriculumStatusBadge status={semester.status} />
                                <ParentStatusForm
                                  entityType="semester"
                                  entityId={semester.id}
                                  status={semester.status}
                                  canEdit={Boolean(user)}
                                />
                              </div>

                              {semester.units.length === 0 ? (
                                <p className="mt-2 text-xs text-muted-foreground">
                                  No units in this semester.
                                </p>
                              ) : (
                                <ul className="mt-2 space-y-2">
                                  {semester.units.map((unit) => (
                                    <li
                                      key={unit.id}
                                      className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-background px-3 py-2"
                                    >
                                      <div className="min-w-0">
                                        <p className="text-sm font-medium">
                                          {unit.code} · {unit.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {unit.credits} credits · v{unit.version}
                                        </p>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <CurriculumStatusBadge status={unit.status} />
                                        <VerificationBadge status={unit.verificationStatus} />
                                        <Link
                                          href={`/admin/curriculum/units/${unit.id}`}
                                          className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                        >
                                          Edit
                                        </Link>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </section>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Add institution</CardTitle>
                <CardDescription>Start with MMUST if it is missing.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={createInstitutionAction} className="space-y-3">
                  <fieldset disabled={!canUseAuth} className="space-y-3">
                    <input type="hidden" name="returnTo" value="/admin/curriculum" />
                    <div className="space-y-1.5">
                      <Label htmlFor="institution-name">Name</Label>
                      <Input
                        id="institution-name"
                        name="name"
                        required
                        placeholder="Masinde Muliro University of Science and Technology"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="institution-country">Country</Label>
                      <Input
                        id="institution-country"
                        name="country"
                        defaultValue="Kenya"
                        required
                      />
                    </div>
                    <Button type="submit" size="sm" disabled={!canUseAuth}>
                      Add institution
                    </Button>
                  </fieldset>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add programme</CardTitle>
                <CardDescription>Codes are unique within an institution.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={createProgrammeAction} className="space-y-3">
                  <fieldset disabled={!canUseAuth} className="space-y-3">
                    <input type="hidden" name="returnTo" value="/admin/curriculum" />
                    <div className="space-y-1.5">
                      <Label htmlFor="programme-institution">Institution</Label>
                      <Select id="programme-institution" name="institutionId" required>
                        <EmptyOptions>Select an institution</EmptyOptions>
                        {overview.map((institution) => (
                          <option key={institution.id} value={institution.id}>
                            {institution.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="programme-code">Code</Label>
                        <Input id="programme-code" name="code" required placeholder="BIT" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="programme-level">Level</Label>
                        <Select id="programme-level" name="level" defaultValue="degree">
                          <option value="certificate">Certificate</option>
                          <option value="diploma">Diploma</option>
                          <option value="degree">Degree</option>
                          <option value="postgraduate">Postgraduate</option>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="programme-title">Title</Label>
                      <Input
                        id="programme-title"
                        name="title"
                        required
                        placeholder="Bachelor of Information Technology"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="programme-duration">Duration (years)</Label>
                      <Input
                        id="programme-duration"
                        name="durationYears"
                        type="number"
                        min={1}
                        max={10}
                        defaultValue={4}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="programme-description">Description</Label>
                      <Textarea
                        id="programme-description"
                        name="description"
                        rows={3}
                        placeholder="Leave blank until the official description is verified."
                      />
                    </div>
                    <Button type="submit" size="sm" disabled={!canUseAuth}>
                      Add programme
                    </Button>
                  </fieldset>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add academic year</CardTitle>
                <CardDescription>Labels are generated from the year number.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={createAcademicYearAction} className="space-y-3">
                  <fieldset disabled={!canUseAuth} className="space-y-3">
                    <input type="hidden" name="returnTo" value="/admin/curriculum" />
                    <div className="space-y-1.5">
                      <Label htmlFor="year-programme">Programme</Label>
                      <Select id="year-programme" name="programmeId" required>
                        <EmptyOptions>Select a programme</EmptyOptions>
                        {programmeOptions.map((programme) => (
                          <option key={programme.id} value={programme.id}>
                            {programme.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="year-number">Year number</Label>
                        <Input
                          id="year-number"
                          name="yearNumber"
                          type="number"
                          min={1}
                          max={10}
                          defaultValue={1}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="year-current">Current</Label>
                        <label className="flex h-9 items-center gap-2 text-sm">
                          <input
                            id="year-current"
                            name="isCurrent"
                            type="checkbox"
                            className="size-4 rounded border-input"
                          />
                          Mark as current
                        </label>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="year-start">Start date</Label>
                        <Input id="year-start" name="startDate" type="date" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="year-end">End date</Label>
                        <Input id="year-end" name="endDate" type="date" />
                      </div>
                    </div>
                    <Button type="submit" size="sm" disabled={!canUseAuth}>
                      Add academic year
                    </Button>
                  </fieldset>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add semester</CardTitle>
                <CardDescription>Number within the academic year.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={createSemesterAction} className="space-y-3">
                  <fieldset disabled={!canUseAuth} className="space-y-3">
                    <input type="hidden" name="returnTo" value="/admin/curriculum" />
                    <div className="space-y-1.5">
                      <Label htmlFor="semester-year">Academic year</Label>
                      <Select id="semester-year" name="academicYearId" required>
                        <EmptyOptions>Select an academic year</EmptyOptions>
                        {yearOptions.map((year) => (
                          <option key={year.id} value={year.id}>
                            {year.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="semester-number">Semester number</Label>
                      <Input
                        id="semester-number"
                        name="number"
                        type="number"
                        min={1}
                        max={3}
                        defaultValue={1}
                        required
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="semester-start">Start date</Label>
                        <Input id="semester-start" name="startDate" type="date" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="semester-end">End date</Label>
                        <Input id="semester-end" name="endDate" type="date" />
                      </div>
                    </div>
                    <Button type="submit" size="sm" disabled={!canUseAuth}>
                      Add semester
                    </Button>
                  </fieldset>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add unit</CardTitle>
                <CardDescription>
                  New units start as draft and unverified.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={createUnitAction} className="space-y-3">
                  <fieldset disabled={!canUseAuth} className="space-y-3">
                    <input type="hidden" name="returnTo" value="/admin/curriculum" />
                    <div className="space-y-1.5">
                      <Label htmlFor="unit-semester">Semester</Label>
                      <Select id="unit-semester" name="semesterId" required>
                        <EmptyOptions>Select a semester</EmptyOptions>
                        {semesterOptions.map((semester) => (
                          <option key={semester.id} value={semester.id}>
                            {semester.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="unit-code">Unit code</Label>
                        <Input id="unit-code" name="code" required placeholder="BIT 111" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="unit-credits">Credits</Label>
                        <Input
                          id="unit-credits"
                          name="credits"
                          type="number"
                          min={0}
                          max={100}
                          defaultValue={0}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="unit-title">Title</Label>
                      <Input
                        id="unit-title"
                        name="title"
                        required
                        placeholder="Discrete Structures for IT"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="unit-description">Description</Label>
                      <Textarea id="unit-description" name="description" rows={3} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="unit-hours">Recommended hours</Label>
                      <Input
                        id="unit-hours"
                        name="recommendedHours"
                        type="number"
                        min={0}
                        max={10000}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="unit-source-notes">Source notes</Label>
                      <Input
                        id="unit-source-notes"
                        name="sourceNotes"
                        placeholder="Why is this record not verified yet?"
                      />
                    </div>
                    <Button type="submit" size="sm" disabled={!canUseAuth}>
                      Add unit and open editor
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </fieldset>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
