import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  check,
  date,
  integer,
  pgTable,
  primaryKey,
  smallint,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { z } from "zod/v4";
import {
  assignmentState,
  assessmentKind,
  attendanceState,
} from "./enums";
import { studentProfilesTable } from "./users-and-students";

export const subjectsTable = pgTable(
  "subjects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectCode: varchar("subject_code", { length: 24 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),
    department: varchar("department", { length: 120 }).notNull(),
    semester: smallint("semester").notNull(),
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
    uniqueIndex("subjects_subject_code_unique").on(table.subjectCode),
    check("subjects_semester_range", sql`${table.semester} BETWEEN 1 AND 12`),
  ],
);

export const insertSubjectSchema = createInsertSchema(subjectsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjectsTable.$inferSelect;

export const attendanceTable = pgTable(
  "attendance",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => studentProfilesTable.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjectsTable.id, { onDelete: "restrict" }),
    attendanceDate: date("attendance_date", { mode: "string" }).notNull(),
    status: attendanceState("status").notNull(),
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
    uniqueIndex("attendance_student_subject_date_unique").on(
      table.studentId,
      table.subjectId,
      table.attendanceDate,
    ),
  ],
);

export const insertAttendanceSchema = createInsertSchema(attendanceTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendanceTable.$inferSelect;

export const assessmentsTable = pgTable(
  "assessments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjectsTable.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 160 }).notNull(),
    kind: assessmentKind("kind").notNull(),
    assessmentDate: date("assessment_date", { mode: "string" }).notNull(),
    maximumScore: integer("maximum_score").notNull(),
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
    check("assessments_maximum_score_positive", sql`${table.maximumScore} > 0`),
  ],
);

export const insertAssessmentSchema = createInsertSchema(
  assessmentsTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessmentsTable.$inferSelect;

export const assessmentMarksTable = pgTable(
  "assessment_marks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessmentsTable.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => studentProfilesTable.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
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
    uniqueIndex("assessment_marks_student_assessment_unique").on(
      table.studentId,
      table.assessmentId,
    ),
    check("assessment_marks_score_nonnegative", sql`${table.score} >= 0`),
  ],
);

export const insertAssessmentMarkSchema = createInsertSchema(
  assessmentMarksTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAssessmentMark = z.infer<typeof insertAssessmentMarkSchema>;
export type AssessmentMark = typeof assessmentMarksTable.$inferSelect;

export const assignmentsTable = pgTable(
  "assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjectsTable.id, { onDelete: "restrict" }),
    assignmentCode: varchar("assignment_code", { length: 32 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    dueDate: date("due_date", { mode: "string" }).notNull(),
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
    uniqueIndex("assignments_subject_code_unique").on(
      table.subjectId,
      table.assignmentCode,
    ),
  ],
);

export const insertAssignmentSchema = createInsertSchema(assignmentsTable).omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true,
  },
);
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignmentsTable.$inferSelect;

export const assignmentSubmissionsTable = pgTable(
  "assignment_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assignmentId: uuid("assignment_id")
      .notNull()
      .references(() => assignmentsTable.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => studentProfilesTable.id, { onDelete: "cascade" }),
    status: assignmentState("status").notNull().default("Pending"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
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
    uniqueIndex("assignment_submissions_student_assignment_unique").on(
      table.studentId,
      table.assignmentId,
    ),
  ],
);

export const insertAssignmentSubmissionSchema = createInsertSchema(
  assignmentSubmissionsTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAssignmentSubmission = z.infer<
  typeof insertAssignmentSubmissionSchema
>;
export type AssignmentSubmission =
  typeof assignmentSubmissionsTable.$inferSelect;
