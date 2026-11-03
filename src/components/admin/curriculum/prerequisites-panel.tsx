import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { UnitDetail } from "@/lib/curriculum";

import {
  addPrerequisiteAction,
  removePrerequisiteAction,
} from "@/app/admin/curriculum/actions";

export function PrerequisitesPanel({
  detail,
  canEdit,
}: {
  detail: UnitDetail;
  canEdit: boolean;
}) {
  const unitId = detail.unit.id;
  const returnTo = `/admin/curriculum/units/${unitId}`;
  const topicMap = new Map(detail.topics.map((topic) => [topic.id, topic]));
  const canAdd = canEdit && detail.topics.length >= 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic prerequisites</CardTitle>
        <CardDescription>
          The server rejects self-references, cross-unit links, duplicates, and
          cycles. Frontend state is never trusted for unlocking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {detail.prerequisites.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            No prerequisites yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {detail.prerequisites.map((edge) => {
              const topic = topicMap.get(edge.topicId);
              const prerequisite = topicMap.get(edge.prerequisiteTopicId);

              return (
                <li
                  key={`${edge.topicId}:${edge.prerequisiteTopicId}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-medium">
                      {topic?.code ?? edge.topicId}
                    </span>{" "}
                    requires{" "}
                    <span className="font-medium">
                      {prerequisite?.code ?? edge.prerequisiteTopicId}
                    </span>
                  </span>
                  <form action={removePrerequisiteAction}>
                    <input type="hidden" name="unitId" value={unitId} />
                    <input type="hidden" name="topicId" value={edge.topicId} />
                    <input
                      type="hidden"
                      name="prerequisiteTopicId"
                      value={edge.prerequisiteTopicId}
                    />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      disabled={!canEdit}
                    >
                      Remove
                    </Button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}

        <form action={addPrerequisiteAction} className="space-y-3 rounded-lg border border-dashed border-border p-3">
          <fieldset disabled={!canAdd} className="space-y-3">
            <input type="hidden" name="unitId" value={unitId} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <p className="text-sm font-medium">Add prerequisite</p>
            {detail.topics.length < 2 ? (
              <p className="text-sm text-muted-foreground">
                Add at least two topics first.
              </p>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="prerequisite-topic">Topic</Label>
                <Select id="prerequisite-topic" name="topicId" required>
                  <option value="" disabled>
                    Select a topic
                  </option>
                  {detail.topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.code} · {topic.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prerequisite-before">Must come before</Label>
                <Select
                  id="prerequisite-before"
                  name="prerequisiteTopicId"
                  required
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  {detail.topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.code} · {topic.title}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <Button type="submit" size="sm" disabled={!canAdd}>
              Add prerequisite
            </Button>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
