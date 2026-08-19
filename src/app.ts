import "dotenv/config";
import db from "./config/db";
import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
    try {
        const result = await db.query("SELECT NOW()");

        res.json({
            message: "Database connected",
            time: result.rows[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed",
        });
    }
});

export default app;