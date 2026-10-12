import { pgEnum } from "drizzle-orm/pg-core";

export const studentReviewStatus = pgEnum("student_review_status", [
  "On track",
  "Needs review",
  "Monitoring",
]);

export const attendanceState = pgEnum("attendance_state", [
  "Present",
  "Absent",
  "Late",
  "Excused",
]);

export const assessmentKind = pgEnum("assessment_kind", [
  "Exam",
  "Quiz",
  "Project",
  "Practical",
]);

export const assignmentState = pgEnum("assignment_state", [
  "Pending",
  "Submitted",
  "Late",
  "Missing",
]);

export const alertSeverity = pgEnum("alert_severity", [
  "Low",
  "Medium",
  "High",
]);

export const alertState = pgEnum("alert_state", [
  "Open",
  "In progress",
  "Resolved",
  "Dismissed",
]);

export const interventionState = pgEnum("intervention_state", [
  "Scheduled",
  "In progress",
  "Completed",
  "Cancelled",
]);

export const followUpState = pgEnum("follow_up_state", [
  "Scheduled",
  "Completed",
  "Missed",
]);
