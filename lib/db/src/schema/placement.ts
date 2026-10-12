import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  check,
  date,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { z } from "zod/v4";
import { studentProfilesTable } from "./users-and-students";

export const skillsTable = pgTable(
  "skills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    category: varchar("category", { length: 60 }).notNull(),
    isSynthetic: boolean("is_synthetic").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
);

export const insertSkillSchema = createInsertSchema(skillsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skillsTable.$inferSelect;

export const studentSkillsTable = pgTable(
  "student_skills",
  {
    studentId: uuid("student_id")
      .notNull()
      .references(() => studentProfilesTable.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skillsTable.id, { onDelete: "cascade" }),
    proficiencyLevel: smallint("proficiency_level").notNull().default(3),
    isSynthetic: boolean("is_synthetic").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.studentId, table.skillId] }),
    check(
      "student_skills_proficiency_range",
      sql`${table.proficiencyLevel} BETWEEN 1 AND 5`,
    ),
  ],
);

export const insertStudentSkillSchema = createInsertSchema(
  studentSkillsTable,
).omit({ createdAt: true });
export type InsertStudentSkill = z.infer<typeof insertStudentSkillSchema>;
export type StudentSkill = typeof studentSkillsTable.$inferSelect;

export const jobListingsTable = pgTable(
  "job_listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    jobCode: varchar("job_code", { length: 32 }).notNull().unique(),
    organization: varchar("organization", { length: 120 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description").notNull().default(""),
    minimumSemester: smallint("minimum_semester").notNull().default(1),
    minimumAverageMarksPercent: smallint("minimum_average_marks_percent")
      .notNull()
      .default(0),
    minimumAttendancePercent: smallint("minimum_attendance_percent")
      .notNull()
      .default(0),
    opensOn: date("opens_on", { mode: "string" }).notNull(),
    closesOn: date("closes_on", { mode: "string" }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isSynthetic: boolean("is_synthetic").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "job_listings_minimum_semester_range",
      sql`${table.minimumSemester} BETWEEN 1 AND 12`,
    ),
    check(
      "job_listings_minimum_marks_range",
      sql`${table.minimumAverageMarksPercent} BETWEEN 0 AND 100`,
    ),
    check(
      "job_listings_minimum_attendance_range",
      sql`${table.minimumAttendancePercent} BETWEEN 0 AND 100`,
    ),
    check("job_listings_date_order", sql`${table.closesOn} >= ${table.opensOn}`),
  ],
);

export const insertJobListingSchema = createInsertSchema(jobListingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertJobListing = z.infer<typeof insertJobListingSchema>;
export type JobListing = typeof jobListingsTable.$inferSelect;

export const jobRequirementsTable = pgTable(
  "job_requirements",
  {
    jobListingId: uuid("job_listing_id")
      .notNull()
      .references(() => jobListingsTable.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skillsTable.id, { onDelete: "restrict" }),
    isRequired: boolean("is_required").notNull().default(true),
    isSynthetic: boolean("is_synthetic").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.jobListingId, table.skillId] }),
  ],
);

export const insertJobRequirementSchema = createInsertSchema(
  jobRequirementsTable,
).omit({ createdAt: true });
export type InsertJobRequirement = z.infer<typeof insertJobRequirementSchema>;
export type JobRequirement = typeof jobRequirementsTable.$inferSelect;
