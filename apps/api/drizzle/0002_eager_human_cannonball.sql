CREATE INDEX "applications_title_lower_idx" ON "applications" USING btree (lower("title"));--> statement-breakpoint
CREATE INDEX "applications_company_lower_idx" ON "applications" USING btree (lower("company"));--> statement-breakpoint
CREATE INDEX "applications_status_date_applied_idx" ON "applications" USING btree ("status","date_applied" DESC NULLS LAST);