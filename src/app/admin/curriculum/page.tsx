import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Curriculum admin" };

export default function AdminCurriculumPage() {
  return (
    <PhasePlaceholder
      title="Curriculum"
      description="Programmes, units, outcomes, prerequisites, and publication state. Unverified data stays draft."
      phase="Planned for Phase 2"
      active="/admin/curriculum"
      admin
    >
      <p className="text-sm leading-6 text-muted-foreground">
        No curriculum records exist yet. Official MMUST programme documents are
        still required before anything can be published as verified.
      </p>
    </PhasePlaceholder>
  );
}
