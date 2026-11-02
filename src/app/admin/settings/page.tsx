import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Platform settings" };

export default function AdminSettingsPage() {
  return (
    <PhasePlaceholder
      title="Platform settings"
      description="Configuration, source access, retention, and audit visibility."
      phase="Planned for Phase 11"
      active="/admin/settings"
      admin
    >
      <p className="text-sm leading-6 text-muted-foreground">
        Retention and privacy settings cannot be finalized until the MMUST and
        Kenya DPA review is complete.
      </p>
    </PhasePlaceholder>
  );
}
