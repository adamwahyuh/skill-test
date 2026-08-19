import db from "../config/db";
import { CleanedMention } from "../types/mention";

export const bulkInsertMentions = async (mentions: CleanedMention[]) => {
    const query = `
        INSERT INTO mentions (external_id, source, title, content, url, author, published_at, engagement)
        SELECT external_id, source, title, content, url, author, published_at, engagement
        FROM jsonb_to_recordset($1::jsonb) AS x(
            external_id VARCHAR, source VARCHAR, title TEXT, content TEXT,
            url TEXT, author VARCHAR, published_at TIMESTAMP WITH TIME ZONE, engagement INTEGER
        )
        ON CONFLICT (url) DO NOTHING;
    `;
    
    // Konversi array object ke format JSON string untuk parameter query
    await db.query(query, [JSON.stringify(mentions)]);
};