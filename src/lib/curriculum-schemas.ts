import { z } from "zod";

import {
  CURRICULUM_STATUSES,
  VERIFICATION_STATUSES,
} from "./curriculum-rules";

const requiredText = (max = 200) => z.string().trim().min(1).max(max);

const nullableText = (max = 20_000) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : null));

const optionalInt = (min: number, max: number) =>
  z
    .preprocess(
      (value) =>
        value === "" || value === null || value === undefined ? null : value,
      z.coerce.number().int().min(min).max(max).nullable(),
    )
    .transform((value) => value ?? null);

export const institutionSchema = z.object({
  name: requiredText(200),
  country: requiredText(100).default("Kenya"),
});

export const programmeSchema = z.object({
  institutionId: requiredText(100),
  code: requiredText(40),
  title: requiredText(200),
  level: z.enum(["certificate", "diploma", "degree", "postgraduate"]),
  durationYears: z.coerce.number().int().min(1).max(10),
  description: nullableText(4_000),
  sourceNotes: nullableText(2_000),
});

export const academicYearSchema = z.object({
  programmeId: requiredText(100),
  yearNumber: z.coerce.number().int().min(1).max(10),
  startDate: nullableText(20),
  endDate: nullableText(20),
  isCurrent: z
    .preprocess(
      (value) => value === "on" || value === "true" || value === true,
      z.boolean(),
    )
    .default(false),
});

export const semesterSchema = z.object({
  academicYearId: requiredText(100),
  number: z.coerce.number().int().min(1).max(3),
  startDate: nullableText(20),
  endDate: nullableText(20),
});

export const unitSchema = z.object({
  semesterId: requiredText(100),
  code: requiredText(40),
  title: requiredText(200),
  description: nullableText(8_000),
  credits: z.coerce.number().int().min(0).max(100),
  recommendedHours: optionalInt(0, 10_000),
  academicRequirements: nullableText(4_000),
  practicalRequirements: nullableText(4_000),
  careerConnections: nullableText(4_000),
  sourceNotes: nullableText(2_000),
});

export const learningOutcomeSchema = z.object({
  unitId: requiredText(100),
  code: requiredText(40),
  statement: requiredText(2_000),
  sortOrder: z.coerce.number().int().min(0).max(10_000),
});

export const topicSchema = z.object({
  unitId: requiredText(100),
  parentTopicId: nullableText(100),
  code: requiredText(40),
  title: requiredText(200),
  introduction: nullableText(8_000),
  objectives: nullableText(4_000),
  estimatedMinutes: z.coerce.number().int().min(1).max(10_000),
  complexity: z.coerce.number().int().min(1).max(5),
  sortOrder: z.coerce.number().int().min(0).max(10_000),
});

export const prerequisiteSchema = z.object({
  unitId: requiredText(100),
  topicId: requiredText(100),
  prerequisiteTopicId: requiredText(100),
});

export const topicOutcomeSchema = z.object({
  unitId: requiredText(100),
  topicId: requiredText(100),
  learningOutcomeId: requiredText(100),
});

export const curriculumStatusSchema = z.enum(CURRICULUM_STATUSES);

export const verificationStatusSchema = z.enum(VERIFICATION_STATUSES);

export const unitStatusSchema = z.object({
  unitId: requiredText(100),
  status: curriculumStatusSchema,
});

export const verificationSchema = z.object({
  entityType: z.enum(["programme", "unit"]),
  entityId: requiredText(100),
  verificationStatus: verificationStatusSchema,
});

export const parentStatusSchema = z.object({
  entityType: z.enum(["programme", "academic_year", "semester"]),
  entityId: requiredText(100),
  status: curriculumStatusSchema,
});

export type InstitutionInput = z.infer<typeof institutionSchema>;
export type ProgrammeInput = z.infer<typeof programmeSchema>;
export type AcademicYearInput = z.infer<typeof academicYearSchema>;
export type SemesterInput = z.infer<typeof semesterSchema>;
export type UnitInput = z.infer<typeof unitSchema>;
export type LearningOutcomeInput = z.infer<typeof learningOutcomeSchema>;
export type TopicInput = z.infer<typeof topicSchema>;
export type PrerequisiteInput = z.infer<typeof prerequisiteSchema>;
export type TopicOutcomeInput = z.infer<typeof topicOutcomeSchema>;
export type CurriculumStatusInput = z.infer<typeof curriculumStatusSchema>;
export type ParentStatusInput = z.infer<typeof parentStatusSchema>;
export type VerificationInput = z.infer<typeof verificationSchema>;
