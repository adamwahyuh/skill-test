export interface RawMention {
    external_id?: string;
    source?: string;
    title?: string | null;
    content?: string;
    url?: string;
    author?: string | null;
    published_at?: string | number | null;
    engagement?: number | string;
}

export interface CleanedMention {
    external_id: string;
    source: string;
    title: string | null;
    content: string;
    url: string;
    author: string | null;
    published_at: string | null;
    engagement: number;
}

export interface SearchFilters {
    q?: string;
    source?: string;
    from?: string;
    to?: string;
}

export interface PaginatedMentions {
    data: CleanedMention[];
    meta: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}