import "dotenv/config";
import db from "./config/db";
import express, { NextFunction, Request, Response } from "express";
import { NotFoundError } from "./errors/AppError";
import { errorHandler } from "./middlewares/error-handler";

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

app.use((req : Request, res : Response, next : NextFunction) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`))
})
app.use(errorHandler)

export default app;