import {
  formatValidationIssues,
  formatValidationIssuesMessage,
  isZodValidationError,
} from "@applyflow/schema";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

function validationErrorResponse(err: { issues: ZodError["issues"] }) {
  const details = formatValidationIssues(err.issues);

  return {
    error: formatValidationIssuesMessage(details),
    details,
  };
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError || isZodValidationError(err)) {
    res.status(400).json(validationErrorResponse(err));
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
