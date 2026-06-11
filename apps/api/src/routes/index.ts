import { Router } from "express";
import { aiRouter } from "./aiRouter";
import { jobRouter } from "./job";
import { resumeRouter } from "./resume";

export const router = Router();

router.use("/ai", aiRouter);
router.use("/job", jobRouter);
router.use("/resume", resumeRouter);
