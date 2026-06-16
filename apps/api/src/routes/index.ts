import { Router } from "express";
import { aiRouter } from "./aiRouter";
import { applicationsRouter } from "./applications";
import { jobRouter } from "./job";
import { resumeRouter } from "./resume";

export const router = Router();

router.use("/ai", aiRouter);
router.use("/applications", applicationsRouter);
router.use("/job", jobRouter);
router.use("/resume", resumeRouter);
