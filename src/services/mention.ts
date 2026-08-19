// src/services/mention.service.ts
import { RawMention, CleanedMention, SearchFilters, PaginatedMentions } from "../types/mention";
import { bulkInsertMentions, getMentionsQuery, getStatsByDayQuery, getStatsBySourceQuery } from "../models/mention";
import { BadRequestError } from "../errors/AppError";

export const processBulkIngest = async (rawMentions: RawMention[]): Promise<void> => {
    const cleanedData: CleanedMention[] = rawMentions.map((m) => {
        
        // format engagement
        let engagement = 0;
        if (typeof m.engagement === "number") {
            engagement = m.engagement;
        } else if (typeof m.engagement === "string") {
            engagement = parseInt(m.engagement.replace(/,/g, ""), 10) || 0;
        }

        // samakan format tanggal
        let published_at = null;
        if (m.published_at) {
            if (typeof m.published_at === "number") {
                // UNIX timestamp ke ISO string
                published_at = new Date(m.published_at * 1000).toISOString();
            } else if (typeof m.published_at === "string" && m.published_at.includes("/")) {
                // Format DD/MM/YYYY
                const [day, month, year] = m.published_at.split("/");
                published_at = new Date(`${year}-${month}-${day}`).toISOString();
            } else {
                // Format ISO biasa
                published_at = new Date(m.published_at).toISOString();
            }
        }

        // samakan source
        const source = m.source ? m.source.trim().toLowerCase() : "unknown";

        return {
            external_id: m.external_id || "",
            source: source,
            title: m.title || null,
            content: m.content || "",
            url: m.url || "",
            author: m.author || null,
            published_at: published_at,
            engagement: engagement,
        };
    });

    // post clean data
    await bulkInsertMentions(cleanedData);
};

export const searchMentions = async (query: any): Promise<PaginatedMentions> => {
    // Tentukan default pagination[cite: 3]
    const page = parseInt(query.page as string, 10) || 1;
    const limit = parseInt(query.limit as string, 10) || 10;
    const offset = (page - 1) * limit;

    const filters: SearchFilters = {
        q: query.q as string,
        source: query.source as string,
        from: query.from as string,
        to: query.to as string,
    };

    const result = await getMentionsQuery(filters, limit, offset);

    return {
        data: result.data as CleanedMention[],
        meta: {
            total: result.total,
            page: page,
            limit: limit,
            total_pages: Math.ceil(result.total / limit)
        }
    };
};

export const getStats = async(groupBy : string | undefined) => {
    if (!groupBy){
        throw new BadRequestError("Query parameter 'group_by' is required. Use 'source' or 'day'.");
    }

    if (groupBy === "source"){
        return await getStatsBySourceQuery();
    } else if (groupBy === "day"){
        return await getStatsByDayQuery();
    } else{
        throw new BadRequestError("Invalid 'group_by' value. Use 'source' or 'day'.");
    }
}