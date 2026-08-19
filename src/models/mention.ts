import db from "../config/db";
import { CleanedMention, SearchFilters } from "../types/mention";

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

export const getMentionsQuery = async (filters: SearchFilters, limit: number, offset: number) => {
    let whereClauses: string[] = [];
    let values: any[] = [];
    let paramIndex = 1;

    // filter Kata Kunci ?q
    if (filters.q) {
        whereClauses.push(`(
            title ILIKE $${paramIndex}
            OR content ILIKE $${paramIndex}
        )`);
        values.push(`%${filters.q}%`);
        paramIndex++;
    }

    // filter Source ?source
    if (filters.source) {
        whereClauses.push(`source = $${paramIndex}`);
        values.push(filters.source.toLowerCase());
        paramIndex++;
    }

    // filter Rentang Waktu ?from & to
    if (filters.from) {
        whereClauses.push(`published_at >= $${paramIndex}`);
        values.push(filters.from);
        paramIndex++;
    }

    if (filters.to) {
        whereClauses.push(`published_at <= $${paramIndex}`);
        values.push(filters.to);
        paramIndex++;
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // urut published_at DESC. 
    // jika ada tanggal yang sama atau null, gunakan "id DESC" sebagai pemecah seri agar urutan tidak pernah berubah-ubah.
    const dataQuery = `
        SELECT external_id, source, title, content, url, author, published_at, engagement
        FROM mentions
        ${whereString}
        ORDER BY published_at DESC NULLS LAST, id DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    // query untuk menghitung total baris (untuk paginasi)
    const countQuery = `
        SELECT COUNT(*)
        FROM mentions
        ${whereString}
    `;

    // run query
    const [dataResult, countResult] = await Promise.all([
        db.query(dataQuery, [...values, limit, offset]),
        db.query(countQuery, values)
    ]);

    return {
        data: dataResult.rows,
        total: parseInt(countResult.rows[0].count, 10)
    };
};

export const getStatsBySourceQuery = async () => {
    const query = `
        SELECT source AS label, COUNT(*)::int AS count
        FROM mentions
        GROUP BY source
        ORDER BY count DESC;
    `;
    const result = await db.query(query);
    return result.rows;
};

export const getStatsByDayQuery = async () => {
    // string format YYYY-MM-DD, abaikan data yang tanggalnya null
    const query = `
        SELECT TO_CHAR(published_at, 'YYYY-MM-DD') AS label, COUNT(*)::int AS count
        FROM mentions
        WHERE published_at IS NOT NULL
        GROUP BY label
        ORDER BY label ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};