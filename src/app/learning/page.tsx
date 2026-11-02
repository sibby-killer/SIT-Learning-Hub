import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Learning" };

export default function LearningPage() {
  return (
    <PhasePlaceholder
      title="Learning"
      description="Units, topics, prerequisites, approved notes, and personal notes will live here."
      phase="Planned for Phase 3"
      active="/learning"
    >
      <p className="text-sm leading-6 text-muted-foreground">
        The unit list is not yet verified against MMUST documentation. This
        screen will show draft content only when it is clearly labelled, and
        will never present an unverified unit as official.
      </p>
    </PhasePlaceholder>
  );
}
