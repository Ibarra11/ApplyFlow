import {
  applicationByUrlQuerySchema,
  createApplicationRequestSchema,
} from "@applyflow/schema";
import { desc, eq } from "drizzle-orm";
import { Router } from "express";

import { db } from "../db/client";
import { applications, type Application as DbApplication } from "../db/schema";
import { validate } from "../middleware/validate";

export const applicationsRouter = Router();

function toApplication(row: DbApplication) {
  return {
    id: row.id,
    url: row.url,
    title: row.title,
    company: row.company,
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

applicationsRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await db.query.applications.findMany({
      orderBy: desc(applications.dateApplied),
    });

    res.json({
      applications: rows.map(toApplication),
    });
  } catch (err) {
    next(err);
  }
});
