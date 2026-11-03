import { randomUUID } from "node:crypto";
import { and, asc, count, eq, inArray } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  academicYears,
  auditLogs,
  institutions,
  learningOutcomes,
  programmes,
  semesters,
  topicOutcomes,
  topicPrerequisites,
  topics,
  units,
} from "@/db/schema";
import type {
  AcademicYearInput,
  CurriculumStatusInput,
  InstitutionInput,
  LearningOutcomeInput,
  PrerequisiteInput,
  ProgrammeInput,
  SemesterInput,
  TopicInput,
  TopicOutcomeInput,
  UnitInput,
} from "@/lib/curriculum-schemas";
import {
  unitPublicationReadiness,
  wouldCreatePrerequisiteCycle,
  type PrerequisiteEdge,
  type VerificationStatus,
} from "@/lib/curriculum-rules";
import { slugify } from "@/lib/utils";

type Db = ReturnType<typeof getDb>;

async function recordAudit(
  db: Db,
  input: {
    actorUserId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
  },
) {
  await db.insert(auditLogs).values({
    id: randomUUID(),
    actorUserId: input.actorUserId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    createdAt: new Date(),
  });
}

async function uniqueSlug(
  taken: Iterable<string>,
  base: string,
  fallback: string,
) {
  const used = new Set(taken);
  const normalized = slugify(base) || fallback;
  let candidate = normalized;
  let suffix = 2;

  while (used.has(candidate)) {
    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function getInstitutionSlug(db: Db, name: string) {
  const rows = await db.select({ slug: institutions.slug }).from(institutions);
  return uniqueSlug(
    rows.map((row) => row.slug),
    name,
    "institution",
  );
}

async function getUnitSlug(
  db: Db,
  semesterId: string,
  code: string,
  title: string,
  excludeUnitId?: string,
) {
  const rows = await db
    .select({ id: units.id, slug: units.slug })
    .from(units)
    .where(eq(units.semesterId, semesterId));

  return uniqueSlug(
    rows.filter((row) => row.id !== excludeUnitId).map((row) => row.slug),
    code || title,
    "unit",
  );
}

async function getTopicSlug(
  db: Db,
  unitId: string,
  code: string,
  title: string,
  excludeTopicId?: string,
) {
  const rows = await db
    .select({ id: topics.id, slug: topics.slug })
    .from(topics)
    .where(eq(topics.unitId, unitId));

  return uniqueSlug(
    rows.filter((row) => row.id !== excludeTopicId).map((row) => row.slug),
    code || title,
    "topic",
  );
}

export async function getCurriculumOverview() {
  const db = getDb();

  return db.query.institutions.findMany({
    orderBy: (table, { asc: ascending }) => [ascending(table.name)],
    with: {
      programmes: {
        orderBy: (table, { asc: ascending }) => [ascending(table.code)],
        with: {
          academicYears: {
            orderBy: (table, { asc: ascending }) => [ascending(table.yearNumber)],
            with: {
              semesters: {
                orderBy: (table, { asc: ascending }) => [ascending(table.number)],
                with: {
                  units: {
                    orderBy: (table, { asc: ascending }) => [ascending(table.code)],
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getUnitDetail(unitId: string) {
  const db = getDb();
  const unitRows = await db
    .select({
      unit: units,
      semester: semesters,
      academicYear: academicYears,
      programme: programmes,
      institution: institutions,
    })
    .from(units)
    .innerJoin(semesters, eq(units.semesterId, semesters.id))
    .innerJoin(academicYears, eq(semesters.academicYearId, academicYears.id))
    .innerJoin(programmes, eq(academicYears.programmeId, programmes.id))
    .innerJoin(institutions, eq(programmes.institutionId, institutions.id))
    .where(eq(units.id, unitId))
    .limit(1);

  const record = unitRows[0];

  if (!record) {
    return null;
  }

  const [outcomes, unitTopics, prerequisiteRows, mappingRows] = await Promise.all([
    db
      .select()
      .from(learningOutcomes)
      .where(eq(learningOutcomes.unitId, unitId))
      .orderBy(asc(learningOutcomes.sortOrder), asc(learningOutcomes.code)),
    db
      .select()
      .from(topics)
      .where(eq(topics.unitId, unitId))
      .orderBy(asc(topics.sortOrder), asc(topics.code)),
    db
      .select({
        topicId: topicPrerequisites.topicId,
        prerequisiteTopicId: topicPrerequisites.prerequisiteTopicId,
      })
      .from(topicPrerequisites)
      .innerJoin(topics, eq(topicPrerequisites.topicId, topics.id))
      .where(eq(topics.unitId, unitId)),
    db
      .select({
        topicId: topicOutcomes.topicId,
        learningOutcomeId: topicOutcomes.learningOutcomeId,
      })
      .from(topicOutcomes)
      .innerJoin(topics, eq(topicOutcomes.topicId, topics.id))
      .where(eq(topics.unitId, unitId)),
  ]);

  return {
    ...record,
    outcomes,
    topics: unitTopics,
    prerequisites: prerequisiteRows,
    mappings: mappingRows,
    readiness: unitPublicationReadiness({
      outcomeCount: outcomes.length,
      topicCount: unitTopics.length,
      verificationStatus: record.unit.verificationStatus,
    }),
  };
}

export async function listPublishedCurriculum() {
  const db = getDb();
  const rows = await db
    .select({
      id: units.id,
      code: units.code,
      title: units.title,
      slug: units.slug,
      description: units.description,
      credits: units.credits,
      recommendedHours: units.recommendedHours,
      careerConnections: units.careerConnections,
      semesterId: semesters.id,
      semesterLabel: semesters.label,
      semesterNumber: semesters.number,
      academicYearLabel: academicYears.label,
      academicYearNumber: academicYears.yearNumber,
      programmeCode: programmes.code,
      programmeTitle: programmes.title,
      institutionName: institutions.name,
    })
    .from(units)
    .innerJoin(semesters, eq(units.semesterId, semesters.id))
    .innerJoin(academicYears, eq(semesters.academicYearId, academicYears.id))
    .innerJoin(programmes, eq(academicYears.programmeId, programmes.id))
    .innerJoin(institutions, eq(programmes.institutionId, institutions.id))
    .where(
      and(
        eq(units.status, "published"),
        eq(units.verificationStatus, "verified"),
        eq(semesters.status, "published"),
        eq(academicYears.status, "published"),
        eq(programmes.status, "published"),
        eq(programmes.verificationStatus, "verified"),
      ),
    )
    .orderBy(
      asc(programmes.title),
      asc(academicYears.yearNumber),
      asc(semesters.number),
      asc(units.code),
    );

  if (rows.length === 0) {
    return [];
  }

  const unitIds = rows.map((row) => row.id);
  const [outcomeCounts, topicCounts] = await Promise.all([
    db
      .select({
        unitId: learningOutcomes.unitId,
        total: count(),
      })
      .from(learningOutcomes)
      .where(inArray(learningOutcomes.unitId, unitIds))
      .groupBy(learningOutcomes.unitId),
    db
      .select({
        unitId: topics.unitId,
        total: count(),
      })
      .from(topics)
      .where(inArray(topics.unitId, unitIds))
      .groupBy(topics.unitId),
  ]);

  const outcomeMap = new Map(
    outcomeCounts.map((row) => [row.unitId, Number(row.total)]),
  );
  const topicMap = new Map(
    topicCounts.map((row) => [row.unitId, Number(row.total)]),
  );

  return rows.map((row) => ({
    ...row,
    outcomeCount: outcomeMap.get(row.id) ?? 0,
    topicCount: topicMap.get(row.id) ?? 0,
  }));
}

export async function createInstitution(
  input: InstitutionInput,
  actorUserId: string,
) {
  const db = getDb();
  const id = randomUUID();
  const slug = await getInstitutionSlug(db, input.name);

  await db.insert(institutions).values({
    id,
    name: input.name,
    slug,
    country: input.country,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await recordAudit(db, {
    actorUserId,
    action: "institution.create",
    entityType: "institution",
    entityId: id,
    metadata: { name: input.name, slug },
  });

  return id;
}

export async function createProgramme(
  input: ProgrammeInput,
  actorUserId: string,
) {
  const db = getDb();
  const institution = await db
    .select({ id: institutions.id })
    .from(institutions)
    .where(eq(institutions.id, input.institutionId))
    .limit(1);

  if (!institution[0]) {
    throw new Error("Choose a valid institution.");
  }

  const id = randomUUID();
  const code = input.code.trim().toUpperCase();

  await db.insert(programmes).values({
    id,
    institutionId: input.institutionId,
    code,
    title: input.title,
    level: input.level,
    description: input.description,
    durationYears: input.durationYears,
    status: "draft",
    verificationStatus: "unverified",
    sourceNotes: input.sourceNotes,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await recordAudit(db, {
    actorUserId,
    action: "programme.create",
    entityType: "programme",
    entityId: id,
    metadata: { code, title: input.title },
  });

  return id;
}

export async function createAcademicYear(
  input: AcademicYearInput,
  actorUserId: string,
) {
  const db = getDb();
  const programme = await db
    .select({ id: programmes.id })
    .from(programmes)
    .where(eq(programmes.id, input.programmeId))
    .limit(1);

  if (!programme[0]) {
    throw new Error("Choose a valid programme.");
  }

  const id = randomUUID();

  await db.insert(academicYears).values({
    id,
    programmeId: input.programmeId,
    label: `Year ${input.yearNumber}`,
    yearNumber: input.yearNumber,
    startDate: input.startDate,
    endDate: input.endDate,
    isCurrent: input.isCurrent,
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await recordAudit(db, {
    actorUserId,
    action: "academic_year.create",
    entityType: "academic_year",
    entityId: id,
    metadata: { yearNumber: input.yearNumber },
  });

  return id;
}

export async function createSemester(
  input: SemesterInput,
  actorUserId: string,
) {
  const db = getDb();
  const academicYear = await db
    .select({ id: academicYears.id })
    .from(academicYears)
    .where(eq(academicYears.id, input.academicYearId))
    .limit(1);

  if (!academicYear[0]) {
    throw new Error("Choose a valid academic year.");
  }

  const id = randomUUID();

  await db.insert(semesters).values({
    id,
    academicYearId: input.academicYearId,
    number: input.number,
    label: `Semester ${input.number}`,
    startDate: input.startDate,
    endDate: input.endDate,
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await recordAudit(db, {
    actorUserId,
    action: "semester.create",
    entityType: "semester",
    entityId: id,
    metadata: { number: input.number },
  });

  return id;
}

export async function createUnit(input: UnitInput, actorUserId: string) {
  const db = getDb();
  const semester = await db
    .select({ id: semesters.id })
    .from(semesters)
    .where(eq(semesters.id, input.semesterId))
    .limit(1);

  if (!semester[0]) {
    throw new Error("Choose a valid semester.");
  }

  const id = randomUUID();
  const code = input.code.trim().toUpperCase();
  const slug = await getUnitSlug(db, input.semesterId, code, input.title);

  await db.insert(units).values({
    id,
    semesterId: input.semesterId,
    code,
    title: input.title,
    slug,
    description: input.description,
    credits: input.credits,
    recommendedHours: input.recommendedHours,
    academicRequirements: input.academicRequirements,
    practicalRequirements: input.practicalRequirements,
    careerConnections: input.careerConnections,
    status: "draft",
    verificationStatus: "unverified",
    sourceNotes: input.sourceNotes,
    version: 1,
    createdBy: actorUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await recordAudit(db, {
    actorUserId,
    action: "unit.create",
    entityType: "unit",
    entityId: id,
    metadata: { code, title: input.title },
  });

  return id;
}

export async function updateUnit(
  unitId: string,
  input: UnitInput,
  actorUserId: string,
) {
  const db = getDb();
  const existing = await db
    .select()
    .from(units)
    .where(eq(units.id, unitId))
    .limit(1);

  if (!existing[0]) {
    throw new Error("Unit not found.");
  }

  const code = input.code.trim().toUpperCase();

  await db
    .update(units)
    .set({
      code,
      title: input.title,
      description: input.description,
      credits: input.credits,
      recommendedHours: input.recommendedHours,
      academicRequirements: input.academicRequirements,
      practicalRequirements: input.practicalRequirements,
      careerConnections: input.careerConnections,
      sourceNotes: input.sourceNotes,
      version: existing[0].version + 1,
      updatedAt: new Date(),
    })
    .where(eq(units.id, unitId));

  await recordAudit(db, {
    actorUserId,
    action: "unit.update",
    entityType: "unit",
    entityId: unitId,
    metadata: { code, title: input.title },
  });
}

export async function setUnitStatus(
  unitId: string,
  status: CurriculumStatusInput,
  actorUserId: string,
) {
  const db = getDb();
  const existing = await db
    .select()
    .from(units)
    .where(eq(units.id, unitId))
    .limit(1);
  const unit = existing[0];

  if (!unit) {
    throw new Error("Unit not found.");
  }

  if (status === "published") {
    const [outcomes, unitTopics] = await Promise.all([
      db
        .select({ id: learningOutcomes.id })
        .from(learningOutcomes)
        .where(eq(learningOutcomes.unitId, unitId)),
      db.select({ id: topics.id }).from(topics).where(eq(topics.unitId, unitId)),
    ]);
    const readiness = unitPublicationReadiness({
      outcomeCount: outcomes.length,
      topicCount: unitTopics.length,
      verificationStatus: unit.verificationStatus,
    });

    if (!readiness.ready) {
      throw new Error(readiness.reasons.join(" "));
    }
  }

  const now = new Date();

  await db
    .update(units)
    .set({
      status,
      version: unit.version + 1,
      reviewedBy: status === "published" ? actorUserId : unit.reviewedBy,
      publishedAt: status === "published" ? now : null,
      updatedAt: now,
    })
    .where(eq(units.id, unitId));

  await recordAudit(db, {
    actorUserId,
    action: `unit.${status}`,
    entityType: "unit",
    entityId: unitId,
    metadata: { previousStatus: unit.status, status },
  });
}

export async function setUnitVerification(
  unitId: string,
  verificationStatus: VerificationStatus,
  actorUserId: string,
) {
  const db = getDb();
  const existing = await db
    .select()
    .from(units)
    .where(eq(units.id, unitId))
    .limit(1);
  const unit = existing[0];

  if (!unit) {
    throw new Error("Unit not found.");
  }

  const now = new Date();
  const unpublish = verificationStatus === "unverified" && unit.status === "published";

  await db
    .update(units)
    .set({
      verificationStatus,
      status: unpublish ? "draft" : unit.status,
      publishedAt: unpublish ? null : unit.publishedAt,
      version: unit.version + 1,
      updatedAt: now,
    })
    .where(eq(units.id, unitId));

  await recordAudit(db, {
    actorUserId,
    action:
      verificationStatus === "verified" ? "unit.verify" : "unit.unverify",
    entityType: "unit",
    entityId: unitId,
    metadata: {
      previousVerificationStatus: unit.verificationStatus,
      verificationStatus,
      previousStatus: unit.status,
      status: unpublish ? "draft" : unit.status,
    },
  });
}

export async function setProgrammeStatus(
  programmeId: string,
  status: CurriculumStatusInput,
  actorUserId: string,
) {
  const db = getDb();
  const existing = await db
    .select()
    .from(programmes)
    .where(eq(programmes.id, programmeId))
    .limit(1);

  if (!existing[0]) {
    throw new Error("Programme not found.");
  }

  if (status === "published" && existing[0].verificationStatus !== "verified") {
    throw new Error("Mark the programme verified before publishing it.");
  }

  await db
    .update(programmes)
    .set({ status, updatedAt: new Date() })
    .where(eq(programmes.id, programmeId));

  await recordAudit(db, {
    actorUserId,
    action: `programme.${status}`,
    entityType: "programme",
    entityId: programmeId,
    metadata: { previousStatus: existing[0].status, status },
  });
}

export async function setProgrammeVerification(
  programmeId: string,
  verificationStatus: VerificationStatus,
  actorUserId: string,
) {
  const db = getDb();
  const existing = await db
    .select()
    .from(programmes)
    .where(eq(programmes.id, programmeId))
    .limit(1);
  const programme = existing[0];

  if (!programme) {
    throw new Error("Programme not found.");
  }

  const unpublish = verificationStatus === "unverified" && programme.status === "published";

  await db
    .update(programmes)
    .set({
      verificationStatus,
      status: unpublish ? "draft" : programme.status,
      updatedAt: new Date(),
    })
    .where(eq(programmes.id, programmeId));

  await recordAudit(db, {
    actorUserId,
    action:
      verificationStatus === "verified"
        ? "programme.verify"
        : "programme.unverify",
    entityType: "programme",
    entityId: programmeId,
    metadata: {
      previousVerificationStatus: programme.verificationStatus,
      verificationStatus,
      previousStatus: programme.status,
      status: unpublish ? "draft" : programme.status,
    },
  });
}

export async function setAcademicYearStatus(
  academicYearId: string,
  status: CurriculumStatusInput,
  actorUserId: string,
) {
  const db = getDb();
  const existing = await db
    .select()
    .from(academicYears)
    .where(eq(academicYears.id, academicYearId))
    .limit(1);

  if (!existing[0]) {
    throw new Error("Academic year not found.");
  }

  await db
    .update(academicYears)
    .set({ status, updatedAt: new Date() })
    .where(eq(academicYears.id, academicYearId));

  await recordAudit(db, {
    actorUserId,
    action: `academic_year.${status}`,
    entityType: "academic_year",
    entityId: academicYearId,
    metadata: { previousStatus: existing[0].status, status },
  });
}

export async function setSemesterStatus(
  semesterId: string,
  status: CurriculumStatusInput,
  actorUserId: string,
) {
  const db = getDb();
  const existing = await db
    .select()
    .from(semesters)
    .where(eq(semesters.id, semesterId))
    .limit(1);

  if (!existing[0]) {
    throw new Error("Semester not found.");
  }

  await db
    .update(semesters)
    .set({ status, updatedAt: new Date() })
    .where(eq(semesters.id, semesterId));

  await recordAudit(db, {
    actorUserId,
    action: `semester.${status}`,
    entityType: "semester",
    entityId: semesterId,
    metadata: { previousStatus: existing[0].status, status },
  });
}

export async function createLearningOutcome(
  input: LearningOutcomeInput,
  actorUserId: string,
) {
  const db = getDb();
  const unit = await db
    .select({ id: units.id })
    .from(units)
    .where(eq(units.id, input.unitId))
    .limit(1);

  if (!unit[0]) {
    throw new Error("Unit not found.");
  }

  const id = randomUUID();
  const code = input.code.trim().toUpperCase();

  await db.insert(learningOutcomes).values({
    id,
    unitId: input.unitId,
    code,
    statement: input.statement,
    sortOrder: input.sortOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await recordAudit(db, {
    actorUserId,
    action: "learning_outcome.create",
    entityType: "learning_outcome",
    entityId: id,
    metadata: { unitId: input.unitId, code },
  });

  return id;
}

export async function updateLearningOutcome(
  outcomeId: string,
  input: LearningOutcomeInput,
  actorUserId: string,
) {
  const db = getDb();
  const existing = await db
    .select()
    .from(learningOutcomes)
    .where(eq(learningOutcomes.id, outcomeId))
    .limit(1);

  if (!existing[0] || existing[0].unitId !== input.unitId) {
    throw new Error("Learning outcome not found for this unit.");
  }

  await db
    .update(learningOutcomes)
    .set({
      code: input.code.trim().toUpperCase(),
      statement: input.statement,
      sortOrder: input.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(learningOutcomes.id, outcomeId));

  await recordAudit(db, {
    actorUserId,
    action: "learning_outcome.update",
    entityType: "learning_outcome",
    entityId: outcomeId,
    metadata: { unitId: input.unitId, code: input.code },
  });
}

export async function createTopic(input: TopicInput, actorUserId: string) {
  const db = getDb();
  const unit = await db
    .select({ id: units.id })
    .from(units)
    .where(eq(units.id, input.unitId))
    .limit(1);

  if (!unit[0]) {
    throw new Error("Unit not found.");
  }

  if (input.parentTopicId) {
    const parent = await db
      .select({ id: topics.id, unitId: topics.unitId })
      .from(topics)
      .where(eq(topics.id, input.parentTopicId))
      .limit(1);

    if (!parent[0] || parent[0].unitId !== input.unitId) {
      throw new Error("Choose a parent topic from the same unit.");
    }
  }

  const id = randomUUID();
  const code = input.code.trim().toUpperCase();
  const slug = await getTopicSlug(db, input.unitId, code, input.title);

  await db.insert(topics).values({
    id,
    unitId: input.unitId,
    parentTopicId: input.parentTopicId,
    code,
    title: input.title,
    slug,
    introduction: input.introduction,
    objectives: input.objectives,
    estimatedMinutes: input.estimatedMinutes,
    complexity: input.complexity,
    sortOrder: input.sortOrder,
    status: "draft",
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await recordAudit(db, {
    actorUserId,
    action: "topic.create",
    entityType: "topic",
    entityId: id,
    metadata: { unitId: input.unitId, code },
  });

  return id;
}

export async function updateTopic(
  topicId: string,
  input: TopicInput,
  actorUserId: string,
) {
  const db = getDb();
  const existing = await db
    .select()
    .from(topics)
    .where(eq(topics.id, topicId))
    .limit(1);

  if (!existing[0] || existing[0].unitId !== input.unitId) {
    throw new Error("Topic not found for this unit.");
  }

  if (input.parentTopicId) {
    if (input.parentTopicId === topicId) {
      throw new Error("A topic cannot be its own parent.");
    }

    const parent = await db
      .select({ id: topics.id, unitId: topics.unitId })
      .from(topics)
      .where(eq(topics.id, input.parentTopicId))
      .limit(1);

    if (!parent[0] || parent[0].unitId !== input.unitId) {
      throw new Error("Choose a parent topic from the same unit.");
    }
  }

  await db
    .update(topics)
    .set({
      parentTopicId: input.parentTopicId,
      code: input.code.trim().toUpperCase(),
      title: input.title,
      introduction: input.introduction,
      objectives: input.objectives,
      estimatedMinutes: input.estimatedMinutes,
      complexity: input.complexity,
      sortOrder: input.sortOrder,
      version: existing[0].version + 1,
      updatedAt: new Date(),
    })
    .where(eq(topics.id, topicId));

  await recordAudit(db, {
    actorUserId,
    action: "topic.update",
    entityType: "topic",
    entityId: topicId,
    metadata: { unitId: input.unitId, code: input.code },
  });
}

export async function addTopicPrerequisite(
  input: PrerequisiteInput,
  actorUserId: string,
) {
  const db = getDb();
  const [unitTopics, existingEdges] = await Promise.all([
    db
      .select({ id: topics.id, code: topics.code })
      .from(topics)
      .where(eq(topics.unitId, input.unitId)),
    db
      .select({
        topicId: topicPrerequisites.topicId,
        prerequisiteTopicId: topicPrerequisites.prerequisiteTopicId,
      })
      .from(topicPrerequisites)
      .innerJoin(topics, eq(topicPrerequisites.topicId, topics.id))
      .where(eq(topics.unitId, input.unitId)),
  ]);

  const topicIds = new Set(unitTopics.map((topic) => topic.id));

  if (!topicIds.has(input.topicId) || !topicIds.has(input.prerequisiteTopicId)) {
    throw new Error("Both topics must belong to this unit.");
  }

  if (input.topicId === input.prerequisiteTopicId) {
    throw new Error("A topic cannot be its own prerequisite.");
  }

  if (
    existingEdges.some(
      (edge) =>
        edge.topicId === input.topicId &&
        edge.prerequisiteTopicId === input.prerequisiteTopicId,
    )
  ) {
    throw new Error("That prerequisite already exists.");
  }

  const edges: PrerequisiteEdge[] = existingEdges;

  if (
    wouldCreatePrerequisiteCycle(
      input.topicId,
      input.prerequisiteTopicId,
      edges,
    )
  ) {
    throw new Error("That prerequisite would create a cycle.");
  }

  await db.insert(topicPrerequisites).values({
    topicId: input.topicId,
    prerequisiteTopicId: input.prerequisiteTopicId,
    createdAt: new Date(),
  });

  await recordAudit(db, {
    actorUserId,
    action: "topic_prerequisite.create",
    entityType: "topic_prerequisite",
    entityId: `${input.topicId}:${input.prerequisiteTopicId}`,
    metadata: input,
  });
}

export async function removeTopicPrerequisite(
  input: PrerequisiteInput,
  actorUserId: string,
) {
  const db = getDb();

  await db
    .delete(topicPrerequisites)
    .where(
      and(
        eq(topicPrerequisites.topicId, input.topicId),
        eq(
          topicPrerequisites.prerequisiteTopicId,
          input.prerequisiteTopicId,
        ),
      ),
    );

  await recordAudit(db, {
    actorUserId,
    action: "topic_prerequisite.delete",
    entityType: "topic_prerequisite",
    entityId: `${input.topicId}:${input.prerequisiteTopicId}`,
    metadata: input,
  });
}

export async function addTopicOutcome(
  input: TopicOutcomeInput,
  actorUserId: string,
) {
  const db = getDb();
  const [topic, outcome] = await Promise.all([
    db
      .select({ id: topics.id, unitId: topics.unitId })
      .from(topics)
      .where(eq(topics.id, input.topicId))
      .limit(1),
    db
      .select({
        id: learningOutcomes.id,
        unitId: learningOutcomes.unitId,
      })
      .from(learningOutcomes)
      .where(eq(learningOutcomes.id, input.learningOutcomeId))
      .limit(1),
  ]);

  if (
    !topic[0] ||
    !outcome[0] ||
    topic[0].unitId !== input.unitId ||
    outcome[0].unitId !== input.unitId
  ) {
    throw new Error("Both the topic and outcome must belong to this unit.");
  }

  const existing = await db
    .select()
    .from(topicOutcomes)
    .where(
      and(
        eq(topicOutcomes.topicId, input.topicId),
        eq(topicOutcomes.learningOutcomeId, input.learningOutcomeId),
      ),
    )
    .limit(1);

  if (existing[0]) {
    throw new Error("That topic is already mapped to the outcome.");
  }

  await db.insert(topicOutcomes).values({
    topicId: input.topicId,
    learningOutcomeId: input.learningOutcomeId,
    createdAt: new Date(),
  });

  await recordAudit(db, {
    actorUserId,
    action: "topic_outcome.create",
    entityType: "topic_outcome",
    entityId: `${input.topicId}:${input.learningOutcomeId}`,
    metadata: input,
  });
}

export type CurriculumOverview = Awaited<
  ReturnType<typeof getCurriculumOverview>
>;
export type UnitDetail = NonNullable<Awaited<ReturnType<typeof getUnitDetail>>>;
export type PublishedCurriculumUnit = Awaited<
  ReturnType<typeof listPublishedCurriculum>
>[number];

export async function removeTopicOutcome(
  input: TopicOutcomeInput,
  actorUserId: string,
) {
  const db = getDb();

  await db
    .delete(topicOutcomes)
    .where(
      and(
        eq(topicOutcomes.topicId, input.topicId),
        eq(topicOutcomes.learningOutcomeId, input.learningOutcomeId),
      ),
    );

  await recordAudit(db, {
    actorUserId,
    action: "topic_outcome.delete",
    entityType: "topic_outcome",
    entityId: `${input.topicId}:${input.learningOutcomeId}`,
    metadata: input,
  });
}
