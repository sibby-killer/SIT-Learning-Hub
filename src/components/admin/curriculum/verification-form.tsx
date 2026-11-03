import { BadgeCheck, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

import { setVerificationAction } from "@/app/admin/curriculum/actions";

export function VerificationForm({
  entityType,
  entityId,
  verificationStatus,
  canEdit,
  returnTo,
}: {
  entityType: "programme" | "unit";
  entityId: string;
  verificationStatus: string;
  canEdit: boolean;
  returnTo: string;
}) {
  const verified = verificationStatus === "verified";

  return (
    <form action={setVerificationAction} className="flex items-center gap-2">
      <input type="hidden" name="entityType" value={entityType} />
      <input type="hidden" name="entityId" value={entityId} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <input
        type="hidden"
        name="verificationStatus"
        value={verified ? "unverified" : "verified"}
      />
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        {verified ? (
          <BadgeCheck className="size-3.5 text-emerald-600" aria-hidden="true" />
        ) : (
          <ShieldAlert className="size-3.5 text-amber-600" aria-hidden="true" />
        )}
        {verified ? "Verified" : "Unverified"}
      </span>
      <Button
        type="submit"
        size="sm"
        variant={verified ? "outline" : "default"}
        disabled={!canEdit}
      >
        {verified ? "Remove verification" : "Mark verified"}
      </Button>
    </form>
  );
}
