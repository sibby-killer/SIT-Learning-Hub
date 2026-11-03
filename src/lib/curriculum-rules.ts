export type PrerequisiteEdge = {
  topicId: string;
  prerequisiteTopicId: string;
};

export function wouldCreatePrerequisiteCycle(
  topicId: string,
  prerequisiteTopicId: string,
  edges: readonly PrerequisiteEdge[],
) {
  if (topicId === prerequisiteTopicId) {
    return true;
  }

  const dependents = new Map<string, string[]>();

  for (const edge of edges) {
    const list = dependents.get(edge.prerequisiteTopicId) ?? [];
    list.push(edge.topicId);
    dependents.set(edge.prerequisiteTopicId, list);
  }

  const pending = [topicId];
  const visited = new Set<string>();

  while (pending.length > 0) {
    const current = pending.pop();

    if (!current || visited.has(current)) {
      continue;
    }

    if (current === prerequisiteTopicId) {
      return true;
    }

    visited.add(current);
    pending.push(...(dependents.get(current) ?? []));
  }

  return false;
}

export function unitPublicationReadiness({
  outcomeCount,
  topicCount,
  verificationStatus,
}: {
  outcomeCount: number;
  topicCount: number;
  verificationStatus: string;
}) {
  const reasons: string[] = [];

  if (outcomeCount < 1) {
    reasons.push("Add at least one measurable learning outcome.");
  }

  if (topicCount < 1) {
    reasons.push("Add at least one topic.");
  }

  if (verificationStatus !== "verified") {
    reasons.push("Mark the unit verified against an official source.");
  }

  return {
    ready: reasons.length === 0,
    reasons,
  };
}

export const CURRICULUM_STATUSES = ["draft", "published", "archived"] as const;

export type CurriculumStatus = (typeof CURRICULUM_STATUSES)[number];

export function isCurriculumStatus(value: string): value is CurriculumStatus {
  return CURRICULUM_STATUSES.includes(value as CurriculumStatus);
}

export const VERIFICATION_STATUSES = ["unverified", "verified"] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export function isVerificationStatus(
  value: string,
): value is VerificationStatus {
  return VERIFICATION_STATUSES.includes(value as VerificationStatus);
}
