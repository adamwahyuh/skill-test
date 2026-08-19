import { Router } from "express";
import { bulkIngest, getMentions, getStatsController } from "./controller";

const router = Router()

router.post("/internal/mentions/bulk", bulkIngest);
router.get("/mentions/stats", getStatsController);
router.get("/mentions", getMentions);

export default router;