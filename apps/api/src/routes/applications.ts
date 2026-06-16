import {
  applicationByUrlQuerySchema,
  applicationIdParamsSchema,
  applicationsQuerySchema,
  createApplicationRequestSchema,
  updateApplicationStatusRequestSchema,
} from "@applyflow/schema";
import { count, desc, eq, type SQL } from "drizzle-orm";
import { Router } from "express";

import { db } from "../db/client";
import { applications, type Application as DbApplication } from "../db/schema";
import { HttpError } from "../middleware/error-handler";
import { validate } from "../middleware/validate";

export const applicationsRouter = Router();

function toApplication(row: DbApplication) {
  return {
    id: row.id,
    url: row.url,
    title: row.title,
    company: row.company,
    status: row.status,
    dateApplied: row.dateApplied.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

applicationsRouter.post(
  "/",
  validate({ body: createApplicationRequestSchema }),
  async (req, res, next) => {
    try {
      const { url, title, company } = req.body;

      const [row] = await db
        .insert(applications)
        .values({ url, title, company })
        .onConflictDoUpdate({
          target: applications.url,
          set: { title, company },
        })
        .returning();

      res.json({ application: toApplication(row) });
    } catch (err) {
      next(err);
    }
  },
);

applicationsRouter.get(
  "/by-url",
  validate({ query: applicationByUrlQuerySchema }),
  async (req, res, next) => {
    try {
      const { url } = applicationByUrlQuerySchema.parse(req.query);

      const row = await db.query.applications.findFirst({
        where: eq(applications.url, url),
      });

      res.json({
        application: row ? toApplication(row) : null,
      });
    } catch (err) {
      next(err);
    }
  },
);

applicationsRouter.get(
  "/",
  validate({ query: applicationsQuerySchema }),
  async (req, res, next) => {
    try {
      const { page, pageSize, status } = applicationsQuerySchema.parse(
        req.query,
      );
      const offset = (page - 1) * pageSize;
      const where: SQL | undefined = status
        ? eq(applications.status, status)
        : undefined;

      const [rows, [{ value: total }]] = await Promise.all([
        db.query.applications.findMany({
          where,
          orderBy: desc(applications.dateApplied),
          limit: pageSize,
          offset,
        }),
        db
          .select({ value: count() })
          .from(applications)
          .where(where),
      ]);

      res.json({
        applications: rows.map(toApplication),
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      });
    } catch (err) {
      next(err);
    }
  },
);

applicationsRouter.patch(
  "/:id",
  validate({
    params: applicationIdParamsSchema,
    body: updateApplicationStatusRequestSchema,
  }),
  async (req, res, next) => {
    try {
      const { id } = applicationIdParamsSchema.parse(req.params);
      const { status } = req.body;

      const [row] = await db
        .update(applications)
        .set({ status })
        .where(eq(applications.id, id))
        .returning();

      if (!row) {
        throw new HttpError(404, "Application not found");
      }

      res.json({ application: toApplication(row) });
    } catch (err) {
      next(err);
    }
  },
);

applicationsRouter.delete(
  "/:id",
  validate({ params: applicationIdParamsSchema }),
  async (req, res, next) => {
    try {
      const { id } = applicationIdParamsSchema.parse(req.params);

      const [row] = await db
        .delete(applications)
        .where(eq(applications.id, id))
        .returning();

      if (!row) {
        throw new HttpError(404, "Application not found");
      }

      res.json({ application: toApplication(row) });
    } catch (err) {
      next(err);
    }
  },
);
