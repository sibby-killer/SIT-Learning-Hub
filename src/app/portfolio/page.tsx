import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <PhasePlaceholder
      title="Portfolio"
      description="Reviewed projects and evidence, with private-by-default visibility controls."
      phase="Planned for Phase 8"
      active="/portfolio"
    >
      <p className="text-sm leading-6 text-muted-foreground">
        Portfolio publication will require explicit consent. Nothing is public
        by default.
      </p>
    </PhasePlaceholder>
  );
}
