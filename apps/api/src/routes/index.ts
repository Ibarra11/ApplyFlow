import { Router } from "express";
import { resumeRouter } from "./resume";

export const router = Router();

router.use("/resume", resumeRouter);
