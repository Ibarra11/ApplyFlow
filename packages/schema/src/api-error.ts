import { z, type ZodIssue } from "zod";

export const apiValidationIssueSchema = z.object({
  path: z.string(),
  message: z.string(),
});

export const apiErrorResponseSchema = z.object({
  error: z.string(),
  details: z.array(apiValidationIssueSchema).optional(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type ApiValidationIssue = z.infer<typeof apiValidationIssueSchema>;

export function formatValidationIssues(issues: ZodIssue[]): ApiValidationIssue[] {
  return issues.map((issue) => ({
    path: issue.path.map(String).join(".") || "request",
    message: issue.message,
  }));
}

export function formatValidationIssuesMessage(
  issues: ApiValidationIssue[],
): string {
  return issues
    .map((issue) =>
      issue.path && issue.path !== "request"
        ? `${issue.path}: ${issue.message}`
        : issue.message,
    )
    .join("; ");
}

export function formatApiErrorMessage(
  data: unknown,
  fallback = "Something went wrong",
): string {
  const parsed = apiErrorResponseSchema.safeParse(data);
  if (!parsed.success) {
    return fallback;
  }

  const { error, details } = parsed.data;
  if (details?.length) {
    return formatValidationIssuesMessage(details);
  }

  return error;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isZodValidationError(
  err: unknown,
): err is { issues: ZodIssue[] } {
  return (
    isRecord(err) &&
    Array.isArray(err.issues) &&
    err.issues.every(
      (issue) =>
        isRecord(issue) &&
        Array.isArray(issue.path) &&
        typeof issue.message === "string",
    )
  );
}
