import {
  answerQuestionRequestSchema,
  jobMatchRequestSchema,
  jobMatchResultSchema,
} from "@applyflow/schema";
import { Router } from "express";
import { generateText, Output } from "ai";

import OpenAIService from "../lib/openai";
import { validate } from "../middleware/validate";
import { ANSWER_QUESTION_PROMPT } from "../prompts/answer-question-prompt";
import { MATCH_JOB_PROMPT } from "../prompts/match-job-prompt";

export const aiRouter = Router();

aiRouter.post(
  "/answer",
  validate({ body: answerQuestionRequestSchema }),
  async (req, res) => {
    const { question, resume, jobDescription } = req.body;

    const openai = new OpenAIService();

    const jobSection = jobDescription
      ? `\n\nJob description:\n${JSON.stringify(jobDescription)}`
      : "";

    const userContent = `Question:\n${question}\n\nResume:\n${JSON.stringify(resume)}${jobSection}`;

    try {
      const { text } = await generateText({
        model: openai.getModel(),
        system: ANSWER_QUESTION_PROMPT,
        messages: [{ role: "user", content: userContent }],
      });

      res.json({ answer: text.trim() });
    } catch (err) {
      console.error("Failed to generate answer:", err);
      res.status(502).json({ error: "Could not generate an answer" });
    }
  },
);

aiRouter.post(
  "/match",
  validate({ body: jobMatchRequestSchema }),
  async (req, res) => {
    const { resume, jobDescription } = req.body;

    const openai = new OpenAIService();

    const userContent = `Resume:\n${JSON.stringify(resume)}\n\nJob description:\n${JSON.stringify(jobDescription)}`;

    try {
      const { text } = await generateText({
        model: openai.getModel(),
        output: Output.object({
          schema: jobMatchResultSchema,
        }),
        system: MATCH_JOB_PROMPT,
        messages: [{ role: "user", content: userContent }],
      });

      const match = JSON.parse(text);

      res.json({ match });
    } catch (err) {
      console.error("Failed to match job:", err);
      res.status(502).json({ error: "Could not generate a job match" });
    }
  },
);
