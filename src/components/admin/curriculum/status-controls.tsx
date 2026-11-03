import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UnitDetail } from "@/lib/curriculum";

import { setUnitStatusAction } from "@/app/admin/curriculum/actions";

import { VerificationForm } from "./verification-form";

export function StatusControls({
  detail,
  canEdit,
}: {
  detail: UnitDetail;
  canEdit: boolean;
}) {
  const unit = detail.unit;
  const returnTo = `/admin/curriculum/units/${unit.id}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publication</CardTitle>
        <CardDescription>
          Students see a unit only when the unit, semester, academic year, and
          programme are published, and the programme and unit are verified.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {detail.readiness.ready ? (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>Minimum publication requirements are met.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            <p className="flex items-center gap-2 font-medium">
              <AlertTriangle className="size-4" aria-hidden="true" />
              Publish requirements not met
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {detail.readiness.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
          <VerificationForm
            entityType="unit"
            entityId={unit.id}
            verificationStatus={unit.verificationStatus}
            canEdit={canEdit}
            returnTo={returnTo}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              ["draft", "Move to draft"],
              ["published", "Publish"],
              ["archived", "Archive"],
            ] as const
          ).map(([status, label]) => (
            <form key={status} action={setUnitStatusAction}>
              <input type="hidden" name="unitId" value={unit.id} />
              <input type="hidden" name="status" value={status} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <Button
                type="submit"
                size="sm"
                variant={
                  status === "published"
                    ? "default"
                    : status === "archived"
                      ? "destructive"
                      : "outline"
                }
                disabled={
                  !canEdit ||
                  unit.status === status ||
                  (status === "published" && !detail.readiness.ready)
                }
              >
                {label}
              </Button>
            </form>
          ))}
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          Current state: <span className="font-medium">{unit.status}</span>,
          version {unit.version}
          {unit.publishedAt
            ? `, published ${unit.publishedAt.toLocaleDateString("en-GB")}`
            : ""}
          . Every status change is written to the audit log.
        </p>
      </CardContent>
    </Card>
  );
}
