import { sql } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const applicationStatus = pgEnum("application_status", [
  "pending",
  "interviewing",
  "offer",
  "rejected",
]);

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull().unique(),
    title: text("title"),
    company: text("company"),
    location: text("location"),
    status: applicationStatus("status").notNull().default("pending"),
    dateApplied: timestamp("date_applied", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    index("applications_title_lower_idx").on(sql`lower(${table.title})`),
    index("applications_company_lower_idx").on(sql`lower(${table.company})`),
    index("applications_status_date_applied_idx").on(
      table.status,
      table.dateApplied.desc(),
    ),
  ],
);

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
