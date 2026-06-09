import { Router } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";

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

  try {
    const result = await parser.getText({ pageJoiner: "" });
    res.json({
      name: file.originalname,
      pages: result.total,
      text: result.text,
    });
  } catch (err) {
    console.error("Failed to parse PDF:", err);
    res.status(422).json({ error: "Could not parse the PDF file" });
  } finally {
    await parser.destroy();
  }
});
