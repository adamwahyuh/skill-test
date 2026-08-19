import { Request, Response } from "express";
import { getStats as getMentionStats, processBulkIngest, searchMentions } from "../../../services/mention";
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

export const getMentions = async (req: Request, res: Response) => {
    const result = await searchMentions(req.query);

    res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta
    });
};

export const getStatsController = async(req : Request, res : Response) => {
    const groupBy = req.query.group_by as string | undefined;

    const data : object = await getMentionStats(groupBy);

    res.status(200).json({
        success: true,
        data: data
    });
}