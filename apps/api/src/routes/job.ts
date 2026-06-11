import { Router } from "express";
import { generateText, Output } from "ai";
import {
  jobDescriptionSchema,
  parseJobRequestSchema,
} from "@applyflow/schema";

import { validate } from "../middleware/validate";
import OpenAIService from "../lib/openai";
import { PARSE_JOB_PROMPT } from "../prompts/parse-job-prompt";

export const jobRouter = Router();

jobRouter.post(
  "/parse",
  validate({ body: parseJobRequestSchema }),
  async (req, res) => {
    const { text } = req.body;

    const openai = new OpenAIService();

    try {
      const { text: result } = await generateText({
        model: openai.getModel(),
        output: Output.object({
          schema: jobDescriptionSchema,
        }),
        system: PARSE_JOB_PROMPT,
        messages: [{ role: "user", content: text }],
      });

      const jobDescription = JSON.parse(result);

      res.json({ jobDescription });
    } catch (err) {
      console.error("Failed to parse job description:", err);
      res.status(422).json({ error: "Could not parse the job description" });
    }
  },
);
