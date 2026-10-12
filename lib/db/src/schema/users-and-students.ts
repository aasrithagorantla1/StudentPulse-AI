import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  check,
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
import { studentReviewStatus } from "./enums";

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authSubject: varchar("auth_subject", { length: 255 }).unique(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    displayName: varchar("display_name", { length: 120 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
);

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

export const rolesTable = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    roleKey: varchar("role_key", { length: 40 }).notNull().unique(),
    displayName: varchar("display_name", { length: 80 }).notNull(),
    description: text("description").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
);

export const insertRoleSchema = createInsertSchema(rolesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof rolesTable.$inferSelect;

export const userRolesTable = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => rolesTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })],
);

export const insertUserRoleSchema = createInsertSchema(userRolesTable).omit({
  createdAt: true,
});
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type UserRole = typeof userRolesTable.$inferSelect;

export const studentProfilesTable = pgTable(
  "student_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentNumber: varchar("student_number", { length: 24 }).notNull().unique(),
    fullName: varchar("full_name", { length: 120 }).notNull(),
    department: varchar("department", { length: 120 }).notNull(),
    semester: smallint("semester").notNull(),
    attendancePercent: smallint("attendance_percent").notNull().default(0),
    averageMarksPercent: smallint("average_marks_percent")
      .notNull()
      .default(0),
    reviewStatus: studentReviewStatus("review_status")
      .notNull()
      .default("On track"),
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
  (table) => [
    check(
      "student_profiles_semester_range",
      sql`${table.semester} BETWEEN 1 AND 12`,
    ),
    check(
      "student_profiles_attendance_range",
      sql`${table.attendancePercent} BETWEEN 0 AND 100`,
    ),
    check(
      "student_profiles_average_marks_range",
      sql`${table.averageMarksPercent} BETWEEN 0 AND 100`,
    ),
  ],
);

export const insertStudentProfileSchema = createInsertSchema(
  studentProfilesTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type StudentProfile = typeof studentProfilesTable.$inferSelect;
