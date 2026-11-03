import { CurriculumStatusBadge } from "@/components/admin/curriculum/curriculum-badges";
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
import type { UnitDetail } from "@/lib/curriculum";

import {
  createTopicAction,
  updateTopicAction,
} from "@/app/admin/curriculum/actions";

export function TopicsPanel({
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
        <CardTitle>Topics</CardTitle>
        <CardDescription>
          Topics are sequenced by sort order. Parent topics create subtopics.
          At least one topic is required before publication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {detail.topics.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            No topics yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {detail.topics.map((topic) => (
              <li key={topic.id} className="rounded-lg border border-border p-3">
                <details>
                  <summary className="flex cursor-pointer flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">
                      {topic.code} · {topic.title}
                    </span>
                    <CurriculumStatusBadge status={topic.status} />
                    <span className="text-xs text-muted-foreground">
                      v{topic.version}
                    </span>
                  </summary>
                  <form action={updateTopicAction} className="mt-3 space-y-3">
                    <fieldset disabled={!canEdit} className="space-y-3">
                      <input type="hidden" name="unitId" value={unitId} />
                      <input type="hidden" name="topicId" value={topic.id} />
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <div className="grid gap-3 sm:grid-cols-[0.35fr_1fr_0.35fr]">
                        <div className="space-y-1.5">
                          <Label htmlFor={`topic-code-${topic.id}`}>Code</Label>
                          <Input
                            id={`topic-code-${topic.id}`}
                            name="code"
                            defaultValue={topic.code}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`topic-title-${topic.id}`}>Title</Label>
                          <Input
                            id={`topic-title-${topic.id}`}
                            name="title"
                            defaultValue={topic.title}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`topic-order-${topic.id}`}>Order</Label>
                          <Input
                            id={`topic-order-${topic.id}`}
                            name="sortOrder"
                            type="number"
                            min={0}
                            max={10000}
                            defaultValue={topic.sortOrder}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`topic-parent-${topic.id}`}>Parent topic</Label>
                        <Select
                          id={`topic-parent-${topic.id}`}
                          name="parentTopicId"
                          defaultValue={topic.parentTopicId ?? ""}
                        >
                          <option value="">No parent</option>
                          {detail.topics
                            .filter((candidate) => candidate.id !== topic.id)
                            .map((candidate) => (
                              <option key={candidate.id} value={candidate.id}>
                                {candidate.code} · {candidate.title}
                              </option>
                            ))}
                        </Select>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor={`topic-minutes-${topic.id}`}>Estimated minutes</Label>
                          <Input
                            id={`topic-minutes-${topic.id}`}
                            name="estimatedMinutes"
                            type="number"
                            min={1}
                            max={10000}
                            defaultValue={topic.estimatedMinutes}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`topic-complexity-${topic.id}`}>Complexity (1-5)</Label>
                          <Input
                            id={`topic-complexity-${topic.id}`}
                            name="complexity"
                            type="number"
                            min={1}
                            max={5}
                            defaultValue={topic.complexity}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`topic-introduction-${topic.id}`}>Introduction</Label>
                        <Textarea
                          id={`topic-introduction-${topic.id}`}
                          name="introduction"
                          rows={3}
                          defaultValue={topic.introduction ?? ""}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`topic-objectives-${topic.id}`}>Objectives</Label>
                        <Textarea
                          id={`topic-objectives-${topic.id}`}
                          name="objectives"
                          rows={3}
                          defaultValue={topic.objectives ?? ""}
                        />
                      </div>
                      <Button type="submit" size="sm" disabled={!canEdit}>
                        Save topic
                      </Button>
                    </fieldset>
                  </form>
                </details>
              </li>
            ))}
          </ul>
        )}

        <form action={createTopicAction} className="space-y-3 rounded-lg border border-dashed border-border p-3">
          <fieldset disabled={!canEdit} className="space-y-3">
            <input type="hidden" name="unitId" value={unitId} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <p className="text-sm font-medium">Add topic</p>
            <div className="grid gap-3 sm:grid-cols-[0.35fr_1fr_0.35fr]">
              <div className="space-y-1.5">
                <Label htmlFor="new-topic-code">Code</Label>
                <Input id="new-topic-code" name="code" placeholder="T1" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-topic-title">Title</Label>
                <Input id="new-topic-title" name="title" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-topic-order">Order</Label>
                <Input
                  id="new-topic-order"
                  name="sortOrder"
                  type="number"
                  min={0}
                  max={10000}
                  defaultValue={detail.topics.length + 1}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-topic-parent">Parent topic</Label>
              <Select id="new-topic-parent" name="parentTopicId" defaultValue="">
                <option value="">No parent</option>
                {detail.topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.code} · {topic.title}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="new-topic-minutes">Estimated minutes</Label>
                <Input
                  id="new-topic-minutes"
                  name="estimatedMinutes"
                  type="number"
                  min={1}
                  max={10000}
                  defaultValue={60}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-topic-complexity">Complexity (1-5)</Label>
                <Input
                  id="new-topic-complexity"
                  name="complexity"
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={1}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-topic-introduction">Introduction</Label>
              <Textarea id="new-topic-introduction" name="introduction" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-topic-objectives">Objectives</Label>
              <Textarea id="new-topic-objectives" name="objectives" rows={2} />
            </div>
            <Button type="submit" size="sm" disabled={!canEdit}>
              Add topic
            </Button>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
