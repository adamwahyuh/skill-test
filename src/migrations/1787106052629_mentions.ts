import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        CREATE TABLE mentions (
            id SERIAL PRIMARY KEY,
            external_id VARCHAR(255) NOT NULL,
            source VARCHAR(255) NOT NULL,
            title TEXT,
            content TEXT NOT NULL,
            url TEXT UNIQUE NOT NULL,
            author VARCHAR(255),
            published_at TIMESTAMP WITH TIME ZONE,
            engagement INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_mentions_source ON mentions(source);
        CREATE INDEX idx_mentions_published_at ON mentions(published_at);
        
        CREATE INDEX idx_mentions_search ON mentions USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        DROP TABLE IF EXISTS mentions CASCADE;
    `);
}