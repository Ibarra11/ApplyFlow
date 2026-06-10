import type { Request, RequestHandler } from "express";
import type { ZodType } from "zod";

export interface RequestSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
  /** Validates `req.file` (populated by multer) for multipart uploads. */
  file?: ZodType;
}

/**
 * Validates parts of the incoming request against the provided Zod schemas.
 * Parsed values replace `req.body`/`req.params` so downstream handlers get the
 * typed, coerced data. A failed parse throws a `ZodError`, which Express
 * forwards to the central error handler (translated into a 400 response).
 */
export function validate(schemas: RequestSchemas): RequestHandler {
  return (req, _res, next) => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as Request["params"];
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      // `req.query` is a read-only getter in Express 5, so validate in place.
      if (schemas.query) {
        schemas.query.parse(req.query);
      }
      if (schemas.file) {
        schemas.file.parse(req.file);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
