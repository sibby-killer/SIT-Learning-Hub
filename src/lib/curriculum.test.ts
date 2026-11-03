// @vitest-environment node

import { randomUUID } from "node:crypto";
import { readFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { closeDb, getDb } from "@/db/client";
import { auditLogs, users } from "@/db/schema";
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
  getUnitDetail,
  listPublishedCurriculum,
  setAcademicYearStatus,
  setProgrammeStatus,
  setProgrammeVerification,
  setSemesterStatus,
  setUnitStatus,
  setUnitVerification,
} from "@/lib/curriculum";

const dbFileName = `test-curriculum-${randomUUID()}.db`;
const dbPath = resolve(".data", dbFileName);
const dbUrl = `file:${dbPath.replace(/\\/g, "/")}`;

const actorId = "test_admin";
const ids: Record<string, string> = {};

describe("curriculum service", () => {
  beforeAll(async () => {
    process.env.TURSO_DATABASE_URL = dbUrl;
    process.env.TURSO_AUTH_TOKEN = "";

    const client = createClient({ url: dbUrl });
    const migrations = [
      readFileSync(resolve("drizzle", "0000_chemical_fixer.sql"), "utf8"),
      readFileSync(resolve("drizzle", "0001_fearless_deadpool.sql"), "utf8"),
    ];

    for (const migration of migrations) {
      await client.executeMultiple(migration);
    }

    await client.close();

    const db = getDb();
    await db.insert(users).values({
      id: actorId,
      email: "admin@example.test",
      fullName: "Test Admin",
      role: "admin",
    });
  });

  afterAll(async () => {
    await closeDb();

    for (const suffix of ["", "-wal", "-shm"]) {
      try {
        rmSync(`${dbPath}${suffix}`, { force: true });
      } catch {
        // Windows may hold the SQLite handle briefly after close.
      }
    }
  });

  it("creates the curriculum hierarchy with draft defaults", async () => {
    ids.institutionId = await createInstitution(
      { name: "Test University", country: "Kenya" },
      actorId,
    );
    ids.programmeId = await createProgramme(
      {
        institutionId: ids.institutionId,
        code: "TST",
        title: "Test Programme",
        level: "degree",
        durationYears: 3,
        description: null,
        sourceNotes: null,
      },
      actorId,
    );
    ids.academicYearId = await createAcademicYear(
      {
        programmeId: ids.programmeId,
        yearNumber: 1,
        startDate: null,
        endDate: null,
        isCurrent: true,
      },
      actorId,
    );
    ids.semesterId = await createSemester(
      {
        academicYearId: ids.academicYearId,
        number: 1,
        startDate: null,
        endDate: null,
      },
      actorId,
    );
    ids.unitId = await createUnit(
      {
        semesterId: ids.semesterId,
        code: "TST 101",
        title: "Test Unit",
        description: null,
        credits: 3,
        recommendedHours: 40,
        academicRequirements: null,
        practicalRequirements: null,
        careerConnections: null,
        sourceNotes: null,
      },
      actorId,
    );
    ids.outcomeId = await createLearningOutcome(
      {
        unitId: ids.unitId,
        code: "LO1",
        statement: "Explain the test concept.",
        sortOrder: 1,
      },
      actorId,
    );
    ids.topicOneId = await createTopic(
      {
        unitId: ids.unitId,
        parentTopicId: null,
        code: "T1",
        title: "First topic",
        introduction: null,
        objectives: null,
        estimatedMinutes: 30,
        complexity: 1,
        sortOrder: 1,
      },
      actorId,
    );
    ids.topicTwoId = await createTopic(
      {
        unitId: ids.unitId,
        parentTopicId: null,
        code: "T2",
        title: "Second topic",
        introduction: null,
        objectives: null,
        estimatedMinutes: 30,
        complexity: 1,
        sortOrder: 2,
      },
      actorId,
    );

    const detail = await getUnitDetail(ids.unitId);

    expect(detail?.unit.status).toBe("draft");
    expect(detail?.unit.verificationStatus).toBe("unverified");
    expect(detail?.readiness.ready).toBe(false);
    expect(detail?.readiness.reasons).toContain(
      "Mark the unit verified against an official source.",
    );
  });

  it("rejects cyclic prerequisites and accepts valid mappings", async () => {
    await addTopicPrerequisite(
      {
        unitId: ids.unitId,
        topicId: ids.topicTwoId,
        prerequisiteTopicId: ids.topicOneId,
      },
      actorId,
    );

    await expect(
      addTopicPrerequisite(
        {
          unitId: ids.unitId,
          topicId: ids.topicOneId,
          prerequisiteTopicId: ids.topicTwoId,
        },
        actorId,
      ),
    ).rejects.toThrow(/cycle/i);

    await addTopicOutcome(
      {
        unitId: ids.unitId,
        topicId: ids.topicOneId,
        learningOutcomeId: ids.outcomeId,
      },
      actorId,
    );

    const detail = await getUnitDetail(ids.unitId);

    expect(detail?.prerequisites).toHaveLength(1);
    expect(detail?.mappings).toHaveLength(1);
  });

  it("publishes only when every parent is published and verified", async () => {
    await expect(
      setUnitStatus(ids.unitId, "published", actorId),
    ).rejects.toThrow(/verified/i);

    await setUnitVerification(ids.unitId, "verified", actorId);
    await setUnitStatus(ids.unitId, "published", actorId);

    expect((await getUnitDetail(ids.unitId))?.unit.status).toBe("published");
    expect(await listPublishedCurriculum()).toHaveLength(0);

    await expect(
      setProgrammeStatus(ids.programmeId, "published", actorId),
    ).rejects.toThrow(/verified/i);

    await setProgrammeVerification(ids.programmeId, "verified", actorId);
    await setProgrammeStatus(ids.programmeId, "published", actorId);
    await setAcademicYearStatus(ids.academicYearId, "published", actorId);
    await setSemesterStatus(ids.semesterId, "published", actorId);

    const published = await listPublishedCurriculum();

    expect(published).toHaveLength(1);
    expect(published[0]).toMatchObject({
      code: "TST 101",
      outcomeCount: 1,
      topicCount: 2,
    });

    const logs = await getDb()
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.actorUserId, actorId));

    expect(logs.length).toBeGreaterThanOrEqual(12);
    expect((await getUnitDetail(ids.unitId))?.unit.version).toBe(3);
  });

  it("unpublishes a unit when verification is removed", async () => {
    await setUnitVerification(ids.unitId, "unverified", actorId);

    const detail = await getUnitDetail(ids.unitId);

    expect(detail?.unit.status).toBe("draft");
    expect(detail?.unit.verificationStatus).toBe("unverified");
    expect(await listPublishedCurriculum()).toHaveLength(0);
  });
});
