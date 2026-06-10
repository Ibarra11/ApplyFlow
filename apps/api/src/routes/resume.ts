import { Router } from "express";
import multer from "multer";
import { generateText, Output } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { resumeSchema } from "@applyflow/schema";

import { SYSTEM_PROMPT } from "../ai/system-prompt";
import { validate } from "../middleware/validate";
import { resumeUploadSchema } from "../schema/resume-upload";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const resumeRouter = Router();

resumeRouter.post(
  "/parse",
  upload.single("resume"),
  validate({ file: resumeUploadSchema }),
  async (req, res) => {
    // Guaranteed present and valid by the `validate` middleware above.
    const file = req.file!;

    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        output: Output.object({
          schema: resumeSchema,
        }),
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "file",
                mediaType: "application/pdf",
                data: file.buffer.toString("base64"),
                filename: file.originalname,
              },
            ],
          },
        ],
      });

      const resume = JSON.parse(text);

      res.json({
        message: "Resume parsed successfully",
        data: {
          name: file.originalname,
          resume,
        },
      });
    } catch (err) {
      console.error("Failed to parse resume:", err);
      res.status(422).json({ error: "Could not parse the resume" });
    }
  },
);
