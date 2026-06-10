import { z } from "zod";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

/**
 * Validates the multipart file (`req.file`) for `POST /resume/parse`.
 * The top-level `error` message is used when no file is present at all.
 */
export const resumeUploadSchema = z.object(
  {
    originalname: z.string(),
    mimetype: z.literal("application/pdf", {
      error: "Only PDF files are supported",
    }),
    size: z.number().max(MAX_FILE_BYTES, "Resume must be 10MB or smaller"),
    buffer: z.instanceof(Buffer),
  },
  { error: "No resume file uploaded" },
);
