import { Badge } from "@/components/ui/badge";

export function CurriculumStatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return <Badge variant="success">Published</Badge>;
  }

  if (status === "archived") {
    return <Badge variant="secondary">Archived</Badge>;
  }

  return <Badge variant="warning">Draft</Badge>;
}

export function VerificationBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "verified" ? "success" : "outline"}>
      {status === "verified" ? "Verified" : "Unverified"}
    </Badge>
  );
}
