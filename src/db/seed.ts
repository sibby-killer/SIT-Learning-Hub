import { getDb } from "./client";
import {
  academicYears,
  institutions,
  programmes,
  semesters,
  systemSettings,
  units,
} from "./schema";

const settings = [
  { key: "platform.name", value: "SIT Learning Hub" },
  { key: "platform.phase", value: "2" },
  { key: "platform.content_status", value: "draft" },
  { key: "platform.curriculum_verified", value: "false" },
  { key: "platform.exam_bank_status", value: "unavailable" },
];

const institution = {
  id: "inst_mmust",
  name: "Masinde Muliro University of Science and Technology",
  slug: "mmust",
  country: "Kenya",
};

const programme = {
  id: "prog_bit",
  institutionId: institution.id,
  code: "BIT",
  title: "Bachelor of Information Technology",
  level: "degree" as const,
  description:
    "Programme record for the School of Information Technology. Structure, title, and accreditation details await official MMUST verification.",
  durationYears: 4,
  status: "draft" as const,
  verificationStatus: "unverified" as const,
  sourceNotes:
    "Programme identity and unit list are based on the master PRD and prior timetable information. Not for publication until verified.",
};

const years = [
  { id: "ay_bit_1", programmeId: programme.id, label: "Year 1", yearNumber: 1 },
  { id: "ay_bit_2", programmeId: programme.id, label: "Year 2", yearNumber: 2 },
];

const semesterRows = [
  {
    id: "sem_bit_1_1",
    academicYearId: "ay_bit_1",
    number: 1,
    label: "Semester 1",
  },
  {
    id: "sem_bit_1_2",
    academicYearId: "ay_bit_1",
    number: 2,
    label: "Semester 2",
  },
  {
    id: "sem_bit_2_1",
    academicYearId: "ay_bit_2",
    number: 1,
    label: "Semester 1",
  },
];

const sourceNotes =
  "Identified from previous timetable information. Unit title, credit value, and semester placement must be verified against official MMUST documentation before publication.";

const unitRows = [
  ["unit_bit_111", "sem_bit_1_1", "BIT 111", "Discrete Structures for IT"],
  ["unit_bit_114", "sem_bit_1_1", "BIT 114", "Electronics Principles"],
  ["unit_bit_115", "sem_bit_1_1", "BIT 115", "Principles of Financial Accounting"],
  ["unit_bcs_111", "sem_bit_1_1", "BCS 111", "Introduction to Programming"],
  ["unit_mmu_111", "sem_bit_1_1", "MMU 111", "Fundamentals of Digital Competency"],
  ["unit_esm_111", "sem_bit_1_1", "ESM 111", "Quantitative Skills 1"],
  ["unit_mat_121", "sem_bit_1_2", "MAT 121", "Differential Calculus"],
] as const;

async function seed() {
  const db = getDb();
  const now = new Date();

  for (const setting of settings) {
    await db
      .insert(systemSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: { value: setting.value, updatedAt: now },
      });
  }

  await db
    .insert(institutions)
    .values({ ...institution, createdAt: now, updatedAt: now })
    .onConflictDoNothing();

  await db
    .insert(programmes)
    .values({ ...programme, createdAt: now, updatedAt: now })
    .onConflictDoNothing();

  for (const year of years) {
    await db
      .insert(academicYears)
      .values({
        ...year,
        status: "draft",
        isCurrent: year.yearNumber === 1,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing();
  }

  for (const semester of semesterRows) {
    await db
      .insert(semesters)
      .values({ ...semester, status: "draft", createdAt: now, updatedAt: now })
      .onConflictDoNothing();
  }

  for (const [id, semesterId, code, title] of unitRows) {
    await db
      .insert(units)
      .values({
        id,
        semesterId,
        code,
        title,
        slug: code.toLowerCase().replace(/\s+/g, "-"),
        status: "draft",
        verificationStatus: "unverified",
        sourceNotes,
        version: 1,
        credits: 0,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing();
  }

  console.log(
    `Seeded ${settings.length} settings, 1 institution, 1 programme, ${years.length} academic years, ${semesterRows.length} semesters, and ${unitRows.length} draft units.`,
  );
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
