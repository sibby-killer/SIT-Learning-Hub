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

import { updateUnitAction } from "@/app/admin/curriculum/actions";

export function UnitMetadataForm({
  detail,
  canEdit,
}: {
  detail: UnitDetail;
  canEdit: boolean;
}) {
  const unit = detail.unit;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit metadata</CardTitle>
        <CardDescription>
          Editing creates a new version. The unit stays in its current
          publication state.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updateUnitAction} className="space-y-3">
          <fieldset disabled={!canEdit} className="space-y-3">
            <input type="hidden" name="unitId" value={unit.id} />
            <input type="hidden" name="semesterId" value={unit.semesterId} />
            <input
              type="hidden"
              name="returnTo"
              value={`/admin/curriculum/units/${unit.id}`}
            />
            <div className="grid gap-3 sm:grid-cols-[1fr_0.4fr_0.4fr]">
              <div className="space-y-1.5">
                <Label htmlFor="unit-code">Unit code</Label>
                <Input id="unit-code" name="code" defaultValue={unit.code} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="unit-credits">Credits</Label>
                <Input
                  id="unit-credits"
                  name="credits"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={unit.credits}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="unit-hours">Hours</Label>
                <Input
                  id="unit-hours"
                  name="recommendedHours"
                  type="number"
                  min={0}
                  max={10000}
                  defaultValue={unit.recommendedHours ?? ""}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="unit-title">Title</Label>
              <Input id="unit-title" name="title" defaultValue={unit.title} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="unit-description">Description</Label>
              <Textarea
                id="unit-description"
                name="description"
                rows={3}
                defaultValue={unit.description ?? ""}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="unit-academic">Academic requirements</Label>
                <Textarea
                  id="unit-academic"
                  name="academicRequirements"
                  rows={3}
                  defaultValue={unit.academicRequirements ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="unit-practical">Practical requirements</Label>
                <Textarea
                  id="unit-practical"
                  name="practicalRequirements"
                  rows={3}
                  defaultValue={unit.practicalRequirements ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="unit-career">Career connections</Label>
                <Textarea
                  id="unit-career"
                  name="careerConnections"
                  rows={3}
                  defaultValue={unit.careerConnections ?? ""}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="unit-source-notes">Source notes</Label>
              <Textarea
                id="unit-source-notes"
                name="sourceNotes"
                rows={2}
                defaultValue={unit.sourceNotes ?? ""}
              />
            </div>
            <Button type="submit" size="sm" disabled={!canEdit}>
              Save new version
            </Button>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
