import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "Study calendar" };

export default function CalendarPage() {
  return (
    <PhasePlaceholder
      title="Study calendar"
      description="A personal, multi-unit study plan with tasks, rescheduling, and honest progress signals."
      phase="Planned for Phase 5"
      active="/calendar"
    >
      <p className="text-sm leading-6 text-muted-foreground">
        Calendar rules, missed-task handling, and reminder behaviour still need
        approval. No schedule is generated or stored in Phase 1.
      </p>
    </PhasePlaceholder>
  );
}
