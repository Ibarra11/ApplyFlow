import { Router } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { generateText, streamText } from "ai";

import { SYSTEM_PROMPT } from "../ai/system-prompt";
import { createOpenAI } from "@ai-sdk/openai";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const resumeRouter = Router();

resumeRouter.post("/parse", upload.single("resume"), async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: "No resume file uploaded" });
    return;
  }

  if (file.mimetype !== "application/pdf") {
    res.status(415).json({ error: "Only PDF files are supported" });
    return;
  }

  const parser = new PDFParse({ data: file.buffer });

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
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

  try {
    res.json({
      message: "Resume parsed successfully",
      data: {
        name: file.originalname,
        resume,
      },
    });
  } catch (err) {
    console.error("Failed to parse PDF:", err);
    res.status(422).json({ error: "Could not parse the PDF file" });
  } finally {
    await parser.destroy();
  }
});
