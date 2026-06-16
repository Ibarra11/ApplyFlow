import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const applicationStatus = pgEnum("application_status", [
  "pending",
  "interviewing",
  "offer",
  "rejected",
]);

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull().unique(),
  title: text("title"),
  company: text("company"),
  status: applicationStatus("status").notNull().default("pending"),
  dateApplied: timestamp("date_applied", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
