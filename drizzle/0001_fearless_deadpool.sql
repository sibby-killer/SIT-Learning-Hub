CREATE TABLE `academic_years` (
	`id` text PRIMARY KEY NOT NULL,
	`programme_id` text NOT NULL,
	`label` text NOT NULL,
	`year_number` integer NOT NULL,
	`start_date` text,
	`end_date` text,
	`is_current` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`programme_id`) REFERENCES `programmes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `academic_years_programme_number_unique` ON `academic_years` (`programme_id`,`year_number`);--> statement-breakpoint
CREATE INDEX `academic_years_programme_idx` ON `academic_years` (`programme_id`);--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`country` text DEFAULT 'Kenya' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `institutions_slug_unique` ON `institutions` (`slug`);--> statement-breakpoint
CREATE TABLE `learning_outcomes` (
	`id` text PRIMARY KEY NOT NULL,
	`unit_id` text NOT NULL,
	`code` text NOT NULL,
	`statement` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `learning_outcomes_unit_code_unique` ON `learning_outcomes` (`unit_id`,`code`);--> statement-breakpoint
CREATE INDEX `learning_outcomes_unit_idx` ON `learning_outcomes` (`unit_id`);--> statement-breakpoint
CREATE TABLE `programmes` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`level` text DEFAULT 'degree' NOT NULL,
	`description` text,
	`duration_years` integer DEFAULT 4 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`verification_status` text DEFAULT 'unverified' NOT NULL,
	`source_notes` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `programmes_institution_code_unique` ON `programmes` (`institution_id`,`code`);--> statement-breakpoint
CREATE INDEX `programmes_institution_idx` ON `programmes` (`institution_id`);--> statement-breakpoint
CREATE INDEX `programmes_status_idx` ON `programmes` (`status`);--> statement-breakpoint
CREATE TABLE `semesters` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`number` integer NOT NULL,
	`label` text NOT NULL,
	`start_date` text,
	`end_date` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `semesters_year_number_unique` ON `semesters` (`academic_year_id`,`number`);--> statement-breakpoint
CREATE INDEX `semesters_year_idx` ON `semesters` (`academic_year_id`);--> statement-breakpoint
CREATE TABLE `topic_outcomes` (
	`topic_id` text NOT NULL,
	`learning_outcome_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	PRIMARY KEY(`topic_id`, `learning_outcome_id`),
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`learning_outcome_id`) REFERENCES `learning_outcomes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `topic_outcomes_outcome_idx` ON `topic_outcomes` (`learning_outcome_id`);--> statement-breakpoint
CREATE TABLE `topic_prerequisites` (
	`topic_id` text NOT NULL,
	`prerequisite_topic_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	PRIMARY KEY(`topic_id`, `prerequisite_topic_id`),
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`prerequisite_topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `topic_prerequisites_prerequisite_idx` ON `topic_prerequisites` (`prerequisite_topic_id`);--> statement-breakpoint
CREATE TABLE `topics` (
	`id` text PRIMARY KEY NOT NULL,
	`unit_id` text NOT NULL,
	`parent_topic_id` text,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`introduction` text,
	`objectives` text,
	`content_md` text,
	`visual_explanation` text,
	`simple_examples` text,
	`worked_examples` text,
	`advanced_examples` text,
	`real_world_application` text,
	`common_mistakes` text,
	`estimated_minutes` integer DEFAULT 60 NOT NULL,
	`complexity` integer DEFAULT 1 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `topics_unit_code_unique` ON `topics` (`unit_id`,`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `topics_unit_slug_unique` ON `topics` (`unit_id`,`slug`);--> statement-breakpoint
CREATE INDEX `topics_unit_idx` ON `topics` (`unit_id`);--> statement-breakpoint
CREATE INDEX `topics_parent_idx` ON `topics` (`parent_topic_id`);--> statement-breakpoint
CREATE TABLE `units` (
	`id` text PRIMARY KEY NOT NULL,
	`semester_id` text NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`credits` integer DEFAULT 0 NOT NULL,
	`recommended_hours` integer,
	`academic_requirements` text,
	`practical_requirements` text,
	`career_connections` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`verification_status` text DEFAULT 'unverified' NOT NULL,
	`source_notes` text,
	`version` integer DEFAULT 1 NOT NULL,
	`created_by` text,
	`reviewed_by` text,
	`published_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `units_semester_code_unique` ON `units` (`semester_id`,`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `units_semester_slug_unique` ON `units` (`semester_id`,`slug`);--> statement-breakpoint
CREATE INDEX `units_semester_idx` ON `units` (`semester_id`);--> statement-breakpoint
CREATE INDEX `units_status_idx` ON `units` (`status`);