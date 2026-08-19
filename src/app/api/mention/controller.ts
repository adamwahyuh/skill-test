import { Request, Response } from "express";
import { processBulkIngest } from "../../../services/mention";
import { BadRequestError } from "../../../errors/AppError";

export const bulkIngest = async (req: Request, res: Response) => {
    const data = req.body;

    // validasi
    if (!Array.isArray(data)) {
        throw new BadRequestError("Payload must be an array of records");
    }

    if (data.length === 0) {
        throw new BadRequestError("Payload array is empty");
    }

    await processBulkIngest(data);

    // response
    res.status(202).json({
        success: true,
        message: "Bulk ingestion processed successfully",
        data : data
    });
};