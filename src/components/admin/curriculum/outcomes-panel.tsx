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
import { Textarea } from "@/components/ui/textarea";
import type { UnitDetail } from "@/lib/curriculum";

import {
  createOutcomeAction,
  updateOutcomeAction,
} from "@/app/admin/curriculum/actions";

export function OutcomesPanel({
  detail,
  canEdit,
}: {
  detail: UnitDetail;
  canEdit: boolean;
}) {
  const unitId = detail.unit.id;
  const returnTo = `/admin/curriculum/units/${unitId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning outcomes</CardTitle>
        <CardDescription>
          At least one outcome is required before publication. Use measurable
          statements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {detail.outcomes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            No outcomes yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {detail.outcomes.map((outcome) => (
              <li key={outcome.id} className="rounded-lg border border-border p-3">
                <details>
                  <summary className="cursor-pointer text-sm font-medium">
                    {outcome.code} · {outcome.statement}
                  </summary>
                  <form action={updateOutcomeAction} className="mt-3 space-y-3">
                    <fieldset disabled={!canEdit} className="space-y-3">
                      <input type="hidden" name="unitId" value={unitId} />
                      <input type="hidden" name="outcomeId" value={outcome.id} />
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <div className="grid gap-3 sm:grid-cols-[0.35fr_0.4fr]">
                        <div className="space-y-1.5">
                          <Label htmlFor={`outcome-code-${outcome.id}`}>Code</Label>
                          <Input
                            id={`outcome-code-${outcome.id}`}
                            name="code"
                            defaultValue={outcome.code}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`outcome-order-${outcome.id}`}>Sort order</Label>
                          <Input
                            id={`outcome-order-${outcome.id}`}
                            name="sortOrder"
                            type="number"
                            min={0}
                            max={10000}
                            defaultValue={outcome.sortOrder}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`outcome-statement-${outcome.id}`}>Statement</Label>
                        <Textarea
                          id={`outcome-statement-${outcome.id}`}
                          name="statement"
                          rows={3}
                          defaultValue={outcome.statement}
                          required
                        />
                      </div>
                      <Button type="submit" size="sm" disabled={!canEdit}>
                        Save outcome
                      </Button>
                    </fieldset>
                  </form>
                </details>
              </li>
            ))}
          </ul>
        )}

        <form action={createOutcomeAction} className="space-y-3 rounded-lg border border-dashed border-border p-3">
          <fieldset disabled={!canEdit} className="space-y-3">
            <input type="hidden" name="unitId" value={unitId} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <p className="text-sm font-medium">Add outcome</p>
            <div className="grid gap-3 sm:grid-cols-[0.35fr_0.4fr]">
              <div className="space-y-1.5">
                <Label htmlFor="new-outcome-code">Code</Label>
                <Input id="new-outcome-code" name="code" placeholder="LO1" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-outcome-order">Sort order</Label>
                <Input
                  id="new-outcome-order"
                  name="sortOrder"
                  type="number"
                  min={0}
                  max={10000}
                  defaultValue={detail.outcomes.length + 1}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-outcome-statement">Statement</Label>
              <Textarea
                id="new-outcome-statement"
                name="statement"
                rows={3}
                placeholder="By the end of this unit, the learner can..."
                required
              />
            </div>
            <Button type="submit" size="sm" disabled={!canEdit}>
              Add outcome
            </Button>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
