import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Career development" };

export default function CareerPage() {
  return (
    <PhasePlaceholder
      title="Career development"
      description="Skills, target roles, evidence, gaps, and a portfolio you can explain."
      phase="Planned for Phase 8"
      active="/career"
    >
      <p className="text-sm leading-6 text-muted-foreground">
        Career readiness will be evidence-based. There will be no unexplained
        employability score and no public portfolio data without explicit
        consent.
      </p>
    </PhasePlaceholder>
  );
}
