import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.statusCode,
                message: err.message
            }
        });
    }

    console.error("SERVER ERROR:", err);

    return res.status(500).json({
        success: false,
        error: {
            code: 500,
            message: "Internal Server Error"
        }
    });
};