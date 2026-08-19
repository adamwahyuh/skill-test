import { Router } from "express";
import { bulkIngest } from "./controller";

const router = Router()

router.post("/internal/mentions/bulk", bulkIngest);

export default router;