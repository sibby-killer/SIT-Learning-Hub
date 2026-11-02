import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return (
    <PhasePlaceholder
      title="Leaderboard"
      description="An optional, privacy-aware leaderboard that rewards demonstrated work, not passive activity."
      phase="Planned for Phase 10"
      active="/leaderboard"
    >
      <p className="text-sm leading-6 text-muted-foreground">
        Participation and public visibility will be opt-in. XP rules will be
        configurable and rate-limited.
      </p>
    </PhasePlaceholder>
  );
}
