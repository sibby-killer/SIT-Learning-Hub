import { PhasePlaceholder } from "@/components/layout/phase-placeholder";

export const metadata = { title: "AI teacher" };

export default function AssistantPage() {
  return (
    <PhasePlaceholder
      title="The teacher agent"
      description="A tool-using, memory-backed agent that teaches, quizzes, plans, and mentors within server-enforced boundaries."
      phase="Planned for Phase 9"
      active="/assistant"
    >
      <p className="text-sm leading-6 text-muted-foreground">
        The agent is not enabled in Phase 1. Its tools will be allowlisted, its
        learner context will be scoped to the signed-in user, and it will never
        change results, roles, or topic locks. Mastra is the selected runtime.
      </p>
    </PhasePlaceholder>
  );
}
