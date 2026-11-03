"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  academicYearSchema,
  institutionSchema,
  learningOutcomeSchema,
  parentStatusSchema,
  prerequisiteSchema,
  programmeSchema,
  semesterSchema,
  topicOutcomeSchema,
  topicSchema,
  unitSchema,
  unitStatusSchema,
  verificationSchema,
} from "@/lib/curriculum-schemas";
import {
  addTopicOutcome,
  addTopicPrerequisite,
  createAcademicYear,
  createInstitution,
  createLearningOutcome,
  createProgramme,
  createSemester,
  createTopic,
  createUnit,
  removeTopicOutcome,
  removeTopicPrerequisite,
  setAcademicYearStatus,
  setProgrammeStatus,
  setProgrammeVerification,
  setSemesterStatus,
  setUnitStatus,
  setUnitVerification,
  updateLearningOutcome,
  updateTopic,
  updateUnit,
} from "@/lib/curriculum";
import { requirePermission } from "@/lib/auth";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry : "";
}

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function safeReturnTo(formData: FormData, fallback: string) {
  const requested = value(formData, "returnTo");

  if (/^\/admin\/curriculum(?:\/units\/[a-zA-Z0-9_-]+)?$/.test(requested)) {
    return requested;
  }

  return fallback;
}

function errorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "The change could not be saved.";
}

async function runAction(
  formData: FormData,
  fallbackPath: string,
  work: (actorUserId: string, formData: FormData) => Promise<string | void>,
) {
  const returnTo = safeReturnTo(formData, fallbackPath);
  const user = await requirePermission("manage_curriculum");
  let successPath = returnTo;

  try {
    successPath = (await work(user.id, formData)) || returnTo;
  } catch (error) {
    redirect(`${returnTo}?error=${encodeURIComponent(errorMessage(error))}`);
  }

  revalidatePath("/admin/curriculum");
  revalidatePath("/learning");
  revalidatePath(successPath);
  redirect(`${successPath}?ok=${encodeURIComponent("Saved.")}`);
}

export async function createInstitutionAction(formData: FormData) {
  await runAction(formData, "/admin/curriculum", async (actorUserId) => {
    await createInstitution(institutionSchema.parse(values(formData)), actorUserId);
  });
}

export async function createProgrammeAction(formData: FormData) {
  await runAction(formData, "/admin/curriculum", async (actorUserId) => {
    await createProgramme(programmeSchema.parse(values(formData)), actorUserId);
  });
}

export async function createAcademicYearAction(formData: FormData) {
  await runAction(formData, "/admin/curriculum", async (actorUserId) => {
    await createAcademicYear(
      academicYearSchema.parse(values(formData)),
      actorUserId,
    );
  });
}

export async function createSemesterAction(formData: FormData) {
  await runAction(formData, "/admin/curriculum", async (actorUserId) => {
    await createSemester(semesterSchema.parse(values(formData)), actorUserId);
  });
}

export async function createUnitAction(formData: FormData) {
  await runAction(formData, "/admin/curriculum", async (actorUserId) => {
    const unitId = await createUnit(unitSchema.parse(values(formData)), actorUserId);
    return `/admin/curriculum/units/${unitId}`;
  });
}

export async function updateUnitAction(formData: FormData) {
  const unitId = value(formData, "unitId");

  await runAction(
    formData,
    `/admin/curriculum/units/${unitId}`,
    async (actorUserId) => {
      await updateUnit(
        unitId,
        unitSchema.parse(values(formData)),
        actorUserId,
      );
    },
  );
}

export async function setUnitStatusAction(formData: FormData) {
  const parsed = unitStatusSchema.parse(values(formData));

  await runAction(
    formData,
    `/admin/curriculum/units/${parsed.unitId}`,
    async (actorUserId) => {
      await setUnitStatus(parsed.unitId, parsed.status, actorUserId);
    },
  );
}

export async function setVerificationAction(formData: FormData) {
  const parsed = verificationSchema.parse(values(formData));

  await runAction(
    formData,
    parsed.entityType === "unit"
      ? `/admin/curriculum/units/${parsed.entityId}`
      : "/admin/curriculum",
    async (actorUserId) => {
      if (parsed.entityType === "unit") {
        await setUnitVerification(
          parsed.entityId,
          parsed.verificationStatus,
          actorUserId,
        );
        return;
      }

      await setProgrammeVerification(
        parsed.entityId,
        parsed.verificationStatus,
        actorUserId,
      );
    },
  );
}

export async function setParentStatusAction(formData: FormData) {
  const parsed = parentStatusSchema.parse(values(formData));

  await runAction(formData, "/admin/curriculum", async (actorUserId) => {
    if (parsed.entityType === "programme") {
      await setProgrammeStatus(parsed.entityId, parsed.status, actorUserId);
      return;
    }

    if (parsed.entityType === "academic_year") {
      await setAcademicYearStatus(parsed.entityId, parsed.status, actorUserId);
      return;
    }

    await setSemesterStatus(parsed.entityId, parsed.status, actorUserId);
  });
}

export async function createOutcomeAction(formData: FormData) {
  const unitId = value(formData, "unitId");

  await runAction(
    formData,
    `/admin/curriculum/units/${unitId}`,
    async (actorUserId) => {
      await createLearningOutcome(
        learningOutcomeSchema.parse(values(formData)),
        actorUserId,
      );
    },
  );
}

export async function updateOutcomeAction(formData: FormData) {
  const unitId = value(formData, "unitId");
  const outcomeId = value(formData, "outcomeId");

  await runAction(
    formData,
    `/admin/curriculum/units/${unitId}`,
    async (actorUserId) => {
      await updateLearningOutcome(
        outcomeId,
        learningOutcomeSchema.parse(values(formData)),
        actorUserId,
      );
    },
  );
}

export async function createTopicAction(formData: FormData) {
  const unitId = value(formData, "unitId");

  await runAction(
    formData,
    `/admin/curriculum/units/${unitId}`,
    async (actorUserId) => {
      await createTopic(topicSchema.parse(values(formData)), actorUserId);
    },
  );
}

export async function updateTopicAction(formData: FormData) {
  const unitId = value(formData, "unitId");
  const topicId = value(formData, "topicId");

  await runAction(
    formData,
    `/admin/curriculum/units/${unitId}`,
    async (actorUserId) => {
      await updateTopic(topicId, topicSchema.parse(values(formData)), actorUserId);
    },
  );
}

export async function addPrerequisiteAction(formData: FormData) {
  const unitId = value(formData, "unitId");

  await runAction(
    formData,
    `/admin/curriculum/units/${unitId}`,
    async (actorUserId) => {
      await addTopicPrerequisite(
        prerequisiteSchema.parse(values(formData)),
        actorUserId,
      );
    },
  );
}

export async function removePrerequisiteAction(formData: FormData) {
  const unitId = value(formData, "unitId");

  await runAction(
    formData,
    `/admin/curriculum/units/${unitId}`,
    async (actorUserId) => {
      await removeTopicPrerequisite(
        prerequisiteSchema.parse(values(formData)),
        actorUserId,
      );
    },
  );
}

export async function addTopicOutcomeAction(formData: FormData) {
  const unitId = value(formData, "unitId");

  await runAction(
    formData,
    `/admin/curriculum/units/${unitId}`,
    async (actorUserId) => {
      await addTopicOutcome(
        topicOutcomeSchema.parse(values(formData)),
        actorUserId,
      );
    },
  );
}

export async function removeTopicOutcomeAction(formData: FormData) {
  const unitId = value(formData, "unitId");

  await runAction(
    formData,
    `/admin/curriculum/units/${unitId}`,
    async (actorUserId) => {
      await removeTopicOutcome(
        topicOutcomeSchema.parse(values(formData)),
        actorUserId,
      );
    },
  );
}
