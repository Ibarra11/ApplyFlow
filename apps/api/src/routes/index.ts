import { Router } from "express";
import { aiRouter } from "./aiRouter";
import { resumeRouter } from "./resume";

export const router = Router();

router.use("/ai", aiRouter);
router.use("/resume", resumeRouter);
