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
  addTopicOutcomeAction,
  removeTopicOutcomeAction,
} from "@/app/admin/curriculum/actions";

export function MappingsPanel({
  detail,
  canEdit,
}: {
  detail: UnitDetail;
  canEdit: boolean;
}) {
  const unitId = detail.unit.id;
  const returnTo = `/admin/curriculum/units/${unitId}`;
  const topicMap = new Map(detail.topics.map((topic) => [topic.id, topic]));
  const outcomeMap = new Map(
    detail.outcomes.map((outcome) => [outcome.id, outcome]),
  );
  const canAdd = canEdit && detail.topics.length > 0 && detail.outcomes.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic-outcome mapping</CardTitle>
        <CardDescription>
          Map each topic to the outcomes it actually teaches. Both records must
          belong to this unit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {detail.mappings.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            No mappings yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {detail.mappings.map((mapping) => {
              const topic = topicMap.get(mapping.topicId);
              const outcome = outcomeMap.get(mapping.learningOutcomeId);

              return (
                <li
                  key={`${mapping.topicId}:${mapping.learningOutcomeId}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-medium">
                      {topic?.code ?? mapping.topicId}
                    </span>{" "}
                    →{" "}
                    <span className="font-medium">
                      {outcome?.code ?? mapping.learningOutcomeId}
                    </span>
                    {outcome ? (
                      <span className="text-muted-foreground">
                        {" "}
                        · {outcome.statement}
                      </span>
                    ) : null}
                  </span>
                  <form action={removeTopicOutcomeAction}>
                    <input type="hidden" name="unitId" value={unitId} />
                    <input type="hidden" name="topicId" value={mapping.topicId} />
                    <input
                      type="hidden"
                      name="learningOutcomeId"
                      value={mapping.learningOutcomeId}
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

        <form action={addTopicOutcomeAction} className="space-y-3 rounded-lg border border-dashed border-border p-3">
          <fieldset disabled={!canAdd} className="space-y-3">
            <input type="hidden" name="unitId" value={unitId} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <p className="text-sm font-medium">Add mapping</p>
            {detail.topics.length === 0 || detail.outcomes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add at least one topic and one outcome first.
              </p>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="mapping-topic">Topic</Label>
                <Select id="mapping-topic" name="topicId" required>
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
                <Label htmlFor="mapping-outcome">Outcome</Label>
                <Select id="mapping-outcome" name="learningOutcomeId" required>
                  <option value="" disabled>
                    Select an outcome
                  </option>
                  {detail.outcomes.map((outcome) => (
                    <option key={outcome.id} value={outcome.id}>
                      {outcome.code} · {outcome.statement}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <Button type="submit" size="sm" disabled={!canAdd}>
              Add mapping
            </Button>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
