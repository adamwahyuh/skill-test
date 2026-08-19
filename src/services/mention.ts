// src/services/mention.service.ts
import { RawMention, CleanedMention } from "../types/mention";
import { bulkInsertMentions } from "../models/mention";

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