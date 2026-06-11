import { Router } from "express";
import multer from "multer";
import { generateText, Output } from "ai";
import { resumeSchema } from "@applyflow/schema";

import { validate } from "../middleware/validate";
import { resumeUploadSchema } from "../schema/resume-upload";
import OpenAIService from "../lib/openai";
import { PARSE_RESUME_PROMPT } from "../prompts/parse-resume-prompt";

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
    const file = req.file!;

    const openai = new OpenAIService();

    try {
      const { text } = await generateText({
        model: openai.getModel(),
        output: Output.object({
          schema: resumeSchema,
        }),
        system: PARSE_RESUME_PROMPT,
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
