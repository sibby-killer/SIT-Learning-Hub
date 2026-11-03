import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

import { setParentStatusAction } from "@/app/admin/curriculum/actions";

export function ParentStatusForm({
  entityType,
  entityId,
  status,
  canEdit,
}: {
  entityType: "programme" | "academic_year" | "semester";
  entityId: string;
  status: string;
  canEdit: boolean;
}) {
  return (
    <form action={setParentStatusAction} className="flex items-center gap-1.5">
      <input type="hidden" name="entityType" value={entityType} />
      <input type="hidden" name="entityId" value={entityId} />
      <input type="hidden" name="returnTo" value="/admin/curriculum" />
      <Select
        name="status"
        defaultValue={status}
        aria-label={`Publication status for ${entityType.replace("_", " ")}`}
        className="h-7 w-28 px-2 text-xs"
        disabled={!canEdit}
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </Select>
      <Button type="submit" size="sm" variant="outline" disabled={!canEdit}>
        Set
      </Button>
    </form>
  );
}
