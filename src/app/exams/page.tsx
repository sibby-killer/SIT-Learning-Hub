import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Assessments" };

export default function ExamsPage() {
  return (
    <PhasePlaceholder
      title="Assessments"
      description="Practice, mock, and final assessment modes, with the 60% progression rule enforced by the backend."
      phase="Planned for Phase 4 and 6"
      active="/exams"
    >
      <p className="text-sm leading-6 text-muted-foreground">
        Exam-bank content remains blocked until MMUST access and licensing are
        confirmed. The assessment engine can be built and tested with
        clearly-labelled sample questions first.
      </p>
    </PhasePlaceholder>
  );
}
