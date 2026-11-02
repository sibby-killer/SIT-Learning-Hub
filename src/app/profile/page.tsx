import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <PhasePlaceholder
      title="Profile"
      description="Your account, programme context, preferences, and data controls."
      phase="Planned for Phase 1 and 11"
      active="/profile"
    >
      <p className="text-sm leading-6 text-muted-foreground">
        The Phase 1 identity model exists, but this screen is not yet wired to a
        live account. Sign-in requires the Clerk and Turso keys.
      </p>
    </PhasePlaceholder>
  );
}
