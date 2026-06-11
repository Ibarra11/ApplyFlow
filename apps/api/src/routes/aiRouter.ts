import { answerQuestionRequestSchema } from "@applyflow/schema";
import { Router } from "express";
import { generateText } from "ai";

import OpenAIService from "../lib/openai";
import { validate } from "../middleware/validate";
import { ANSWER_QUESTION_PROMPT } from "../prompts/answer-question-prompt";

export const aiRouter = Router();

aiRouter.post(
  "/answer",
  validate({ body: answerQuestionRequestSchema }),
  async (req, res) => {
    debugger;
    const { question, resume } = req.body;

    const openai = new OpenAIService();

    const userContent = `Question:\n${question}\n\nResume:\n${JSON.stringify(resume)}`;

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
