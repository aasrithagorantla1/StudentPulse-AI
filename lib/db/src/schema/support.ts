import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import {
  alertSeverity,
  alertState,
  followUpState,
  interventionState,
} from "./enums";
import { studentProfilesTable, usersTable } from "./users-and-students";

export const alertsTable = pgTable(
  "alerts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => studentProfilesTable.id, { onDelete: "cascade" }),
    category: varchar("category", { length: 60 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    detail: text("detail").notNull().default(""),
    severity: alertSeverity("severity").notNull(),
    status: alertState("status").notNull().default("Open"),
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

export const insertAlertSchema = createInsertSchema(alertsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alertsTable.$inferSelect;

export const interventionsTable = pgTable(
  "interventions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    interventionCode: varchar("intervention_code", { length: 32 })
      .notNull()
      .unique(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => studentProfilesTable.id, { onDelete: "restrict" }),
    supportType: varchar("support_type", { length: 80 }).notNull(),
    mentorName: varchar("mentor_name", { length: 120 }).notNull(),
    mentorUserId: uuid("mentor_user_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    followUpDate: date("follow_up_date", { mode: "string" }).notNull(),
    status: interventionState("status").notNull().default("Scheduled"),
    notes: text("notes").notNull().default(""),
    isSynthetic: boolean("is_synthetic").notNull().default(false),
    createdByUserId: uuid("created_by_user_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
);

export const insertInterventionSchema = createInsertSchema(
  interventionsTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertIntervention = z.infer<typeof insertInterventionSchema>;
export type Intervention = typeof interventionsTable.$inferSelect;

export const interventionFollowUpsTable = pgTable(
  "intervention_follow_ups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    interventionId: uuid("intervention_id")
      .notNull()
      .references(() => interventionsTable.id, { onDelete: "cascade" }),
    dueDate: date("due_date", { mode: "string" }).notNull(),
    status: followUpState("status").notNull().default("Scheduled"),
    outcome: text("outcome").notNull().default(""),
    completedAt: timestamp("completed_at", { withTimezone: true }),
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
    uniqueIndex("intervention_follow_ups_intervention_due_unique").on(
      table.interventionId,
      table.dueDate,
    ),
  ],
);

export const insertInterventionFollowUpSchema = createInsertSchema(
  interventionFollowUpsTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertInterventionFollowUp = z.infer<
  typeof insertInterventionFollowUpSchema
>;
export type InterventionFollowUp =
  typeof interventionFollowUpsTable.$inferSelect;
