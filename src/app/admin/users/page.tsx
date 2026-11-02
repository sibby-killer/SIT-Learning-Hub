import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Users admin" };

export default function AdminUsersPage() {
  return (
    <PhasePlaceholder
      title="Users and roles"
      description="Student, reviewer, and administrator access. The first admin comes from ADMIN_EMAILS, not public signup."
      phase="Phase 1 foundation, expanded later"
      active="/admin/users"
      admin
    >
      <p className="text-sm leading-6 text-muted-foreground">
        The identity and audit tables exist in the schema. Live user management
        requires Clerk and Turso keys.
      </p>
    </PhasePlaceholder>
  );
}
