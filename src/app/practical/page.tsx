import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Practical work" };

export default function PracticalPage() {
  return (
    <PhasePlaceholder
      title="Practical work"
      description="Projects, milestones, deliverables, evidence, and human review."
      phase="Planned for Phase 7"
      active="/practical"
    >
      <p className="text-sm leading-6 text-muted-foreground">
        Practical completion will be separate from academic progress. Evidence
        will be stored privately and reviewed; no completion is inferred from an
        AI response.
      </p>
    </PhasePlaceholder>
  );
}
