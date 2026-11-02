import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Analytics admin" };

export default function AdminAnalyticsPage() {
  return (
    <PhasePlaceholder
      title="Analytics"
      description="Progress, assessment quality, content coverage, and agent safety signals."
      phase="Planned for Phase 10"
      active="/admin/analytics"
      admin
    >
      <p className="text-sm leading-6 text-muted-foreground">
        No analytics are collected or displayed in Phase 1.
      </p>
    </PhasePlaceholder>
  );
}
