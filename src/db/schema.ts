import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";

const timestamp = (name: string) =>
  integer(name, { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`);

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    fullName: text("full_name"),
    imageUrl: text("image_url"),
    role: text("role", { enum: ["student", "reviewer", "admin"] })
      .notNull()
      .default("student"),
    status: text("status", { enum: ["active", "suspended"] })
      .notNull()
      .default("active"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const userProfiles = sqliteTable(
  "user_profiles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    programme: text("programme"),
    yearOfStudy: integer("year_of_study"),
    semester: integer("semester"),
    timezone: text("timezone").notNull().default("Africa/Nairobi"),
    bio: text("bio"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [index("user_profiles_programme_idx").on(table.programme)],
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    actorUserId: text("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    metadata: text("metadata"),
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at"),
  },
  (table) => [
    index("audit_logs_actor_idx").on(table.actorUserId),
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
    index("audit_logs_created_idx").on(table.createdAt),
  ],
);

export const systemSettings = sqliteTable("system_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at"),
});

const curriculumStatuses = ["draft", "published", "archived"] as const;
const verificationStatuses = ["unverified", "verified"] as const;

export const institutions = sqliteTable(
  "institutions",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    country: text("country").notNull().default("Kenya"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [uniqueIndex("institutions_slug_unique").on(table.slug)],
);

export const programmes = sqliteTable(
  "programmes",
  {
    id: text("id").primaryKey(),
    institutionId: text("institution_id")
      .notNull()
      .references(() => institutions.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    title: text("title").notNull(),
    level: text("level", {
      enum: ["certificate", "diploma", "degree", "postgraduate"],
    })
      .notNull()
      .default("degree"),
    description: text("description"),
    durationYears: integer("duration_years").notNull().default(4),
    status: text("status", { enum: curriculumStatuses })
      .notNull()
      .default("draft"),
    verificationStatus: text("verification_status", {
      enum: verificationStatuses,
    })
      .notNull()
      .default("unverified"),
    sourceNotes: text("source_notes"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    uniqueIndex("programmes_institution_code_unique").on(
      table.institutionId,
      table.code,
    ),
    index("programmes_institution_idx").on(table.institutionId),
    index("programmes_status_idx").on(table.status),
  ],
);

export const academicYears = sqliteTable(
  "academic_years",
  {
    id: text("id").primaryKey(),
    programmeId: text("programme_id")
      .notNull()
      .references(() => programmes.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    yearNumber: integer("year_number").notNull(),
    startDate: text("start_date"),
    endDate: text("end_date"),
    isCurrent: integer("is_current", { mode: "boolean" })
      .notNull()
      .default(false),
    status: text("status", { enum: curriculumStatuses })
      .notNull()
      .default("draft"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    uniqueIndex("academic_years_programme_number_unique").on(
      table.programmeId,
      table.yearNumber,
    ),
    index("academic_years_programme_idx").on(table.programmeId),
  ],
);

export const semesters = sqliteTable(
  "semesters",
  {
    id: text("id").primaryKey(),
    academicYearId: text("academic_year_id")
      .notNull()
      .references(() => academicYears.id, { onDelete: "cascade" }),
    number: integer("number").notNull(),
    label: text("label").notNull(),
    startDate: text("start_date"),
    endDate: text("end_date"),
    status: text("status", { enum: curriculumStatuses })
      .notNull()
      .default("draft"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    uniqueIndex("semesters_year_number_unique").on(
      table.academicYearId,
      table.number,
    ),
    index("semesters_year_idx").on(table.academicYearId),
  ],
);

export const units = sqliteTable(
  "units",
  {
    id: text("id").primaryKey(),
    semesterId: text("semester_id")
      .notNull()
      .references(() => semesters.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    credits: integer("credits").notNull().default(0),
    recommendedHours: integer("recommended_hours"),
    academicRequirements: text("academic_requirements"),
    practicalRequirements: text("practical_requirements"),
    careerConnections: text("career_connections"),
    status: text("status", { enum: curriculumStatuses })
      .notNull()
      .default("draft"),
    verificationStatus: text("verification_status", {
      enum: verificationStatuses,
    })
      .notNull()
      .default("unverified"),
    sourceNotes: text("source_notes"),
    version: integer("version").notNull().default(1),
    createdBy: text("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedBy: text("reviewed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    uniqueIndex("units_semester_code_unique").on(
      table.semesterId,
      table.code,
    ),
    uniqueIndex("units_semester_slug_unique").on(
      table.semesterId,
      table.slug,
    ),
    index("units_semester_idx").on(table.semesterId),
    index("units_status_idx").on(table.status),
  ],
);

export const learningOutcomes = sqliteTable(
  "learning_outcomes",
  {
    id: text("id").primaryKey(),
    unitId: text("unit_id")
      .notNull()
      .references(() => units.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    statement: text("statement").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    uniqueIndex("learning_outcomes_unit_code_unique").on(
      table.unitId,
      table.code,
    ),
    index("learning_outcomes_unit_idx").on(table.unitId),
  ],
);

export const topics = sqliteTable(
  "topics",
  {
    id: text("id").primaryKey(),
    unitId: text("unit_id")
      .notNull()
      .references(() => units.id, { onDelete: "cascade" }),
    parentTopicId: text("parent_topic_id").references(
      (): AnySQLiteColumn => topics.id,
      { onDelete: "cascade" },
    ),
    code: text("code").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    introduction: text("introduction"),
    objectives: text("objectives"),
    contentMd: text("content_md"),
    visualExplanation: text("visual_explanation"),
    simpleExamples: text("simple_examples"),
    workedExamples: text("worked_examples"),
    advancedExamples: text("advanced_examples"),
    realWorldApplication: text("real_world_application"),
    commonMistakes: text("common_mistakes"),
    estimatedMinutes: integer("estimated_minutes").notNull().default(60),
    complexity: integer("complexity").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(0),
    status: text("status", { enum: curriculumStatuses })
      .notNull()
      .default("draft"),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    uniqueIndex("topics_unit_code_unique").on(table.unitId, table.code),
    uniqueIndex("topics_unit_slug_unique").on(table.unitId, table.slug),
    index("topics_unit_idx").on(table.unitId),
    index("topics_parent_idx").on(table.parentTopicId),
  ],
);

export const topicPrerequisites = sqliteTable(
  "topic_prerequisites",
  {
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    prerequisiteTopicId: text("prerequisite_topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at"),
  },
  (table) => [
    primaryKey({
      columns: [table.topicId, table.prerequisiteTopicId],
      name: "topic_prerequisites_pk",
    }),
    index("topic_prerequisites_prerequisite_idx").on(
      table.prerequisiteTopicId,
    ),
  ],
);

export const topicOutcomes = sqliteTable(
  "topic_outcomes",
  {
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    learningOutcomeId: text("learning_outcome_id")
      .notNull()
      .references(() => learningOutcomes.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at"),
  },
  (table) => [
    primaryKey({
      columns: [table.topicId, table.learningOutcomeId],
      name: "topic_outcomes_pk",
    }),
    index("topic_outcomes_outcome_idx").on(table.learningOutcomeId),
  ],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  auditLogs: many(auditLogs),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.actorUserId],
    references: [users.id],
  }),
}));

export const institutionsRelations = relations(institutions, ({ many }) => ({
  programmes: many(programmes),
}));

export const programmesRelations = relations(programmes, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [programmes.institutionId],
    references: [institutions.id],
  }),
  academicYears: many(academicYears),
}));

export const academicYearsRelations = relations(
  academicYears,
  ({ one, many }) => ({
    programme: one(programmes, {
      fields: [academicYears.programmeId],
      references: [programmes.id],
    }),
    semesters: many(semesters),
  }),
);

export const semestersRelations = relations(semesters, ({ one, many }) => ({
  academicYear: one(academicYears, {
    fields: [semesters.academicYearId],
    references: [academicYears.id],
  }),
  units: many(units),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  semester: one(semesters, {
    fields: [units.semesterId],
    references: [semesters.id],
  }),
  learningOutcomes: many(learningOutcomes),
  topics: many(topics),
}));

export const learningOutcomesRelations = relations(
  learningOutcomes,
  ({ one, many }) => ({
    unit: one(units, {
      fields: [learningOutcomes.unitId],
      references: [units.id],
    }),
    topicOutcomes: many(topicOutcomes),
  }),
);

export const topicsRelations = relations(topics, ({ one, many }) => ({
  unit: one(units, {
    fields: [topics.unitId],
    references: [units.id],
  }),
  prerequisites: many(topicPrerequisites),
  topicOutcomes: many(topicOutcomes),
}));

export const topicPrerequisitesRelations = relations(
  topicPrerequisites,
  ({ one }) => ({
    topic: one(topics, {
      fields: [topicPrerequisites.topicId],
      references: [topics.id],
    }),
    prerequisite: one(topics, {
      fields: [topicPrerequisites.prerequisiteTopicId],
      references: [topics.id],
      relationName: "prerequisiteTopic",
    }),
  }),
);

export const topicOutcomesRelations = relations(topicOutcomes, ({ one }) => ({
  topic: one(topics, {
    fields: [topicOutcomes.topicId],
    references: [topics.id],
  }),
  learningOutcome: one(learningOutcomes, {
    fields: [topicOutcomes.learningOutcomeId],
    references: [learningOutcomes.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type Institution = typeof institutions.$inferSelect;
export type Programme = typeof programmes.$inferSelect;
export type AcademicYear = typeof academicYears.$inferSelect;
export type Semester = typeof semesters.$inferSelect;
export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export type LearningOutcome = typeof learningOutcomes.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;
export type TopicPrerequisite = typeof topicPrerequisites.$inferSelect;
export type TopicOutcome = typeof topicOutcomes.$inferSelect;
