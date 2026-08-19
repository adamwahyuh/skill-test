import { Router } from "express";
import { bulkIngest, getMentions } from "./controller";

const router = Router()

router.post("/internal/mentions/bulk", bulkIngest);
router.get("/mentions", getMentions);

export default router;