import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <PhasePlaceholder
      title="Settings"
      description="Notification, privacy, accessibility, and learning preferences."
      phase="Planned for later phases"
      active="/settings"
    >
      <p className="text-sm leading-6 text-muted-foreground">
        Settings that affect retention or visibility will be tied to the privacy
        decision and will be auditable.
      </p>
    </PhasePlaceholder>
  );
}
