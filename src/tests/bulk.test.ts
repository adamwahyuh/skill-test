import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../app";

// MOCK DATABASE: Mencegah test menulis ke database beneran
vi.mock("../config/db", () => {
    return {
        default: {
            query: vi.fn().mockResolvedValue({ rowCount: 1, rows: [] })
        }
    };
});

describe("POST /internal/mentions/bulk", () => {
    it("berhasil melakukan bulk ingest dengan data seed dan mengembalikan status 202", async () => {
        const seedData = [
            {
                "external_id": "str-99120",
                "source": "The Star",
                "title": "Ringgit strengthens against US dollar in early trade",
                "content": "<p>The ringgit opened higher against the greenback on Monday, buoyed by improved sentiment.</p>",
                "url": "https://www.thestar.com.my/business/2026/08/10/ringgit-strengthens",
                "author": "Aisyah Rahman",
                "published_at": "2026-08-10T08:15:00Z",
                "engagement": 412
            },
            {
                "external_id": "nst-40088",
                "source": "New Straits Times",
                "title": "MRT Line 3 construction hits 40% completion",
                "content": "<div class=\"article\">Works on the MRT3 Circle Line have reached 40 per cent, said the transport minister.</div>",
                "url": "https://www.nst.com.my/news/nation/2026/08/mrt3-40-percent",
                "author": "Hafiz Ismail",
                "published_at": 1786435200,
                "engagement": 88
            }
        ];

        const payloadLenght : number = seedData.length

        // hit endpoint
        const response = await request(app)
            .post("/internal/mentions/bulk")
            .send(seedData);

        // assert
        expect(response.status).toBe(202);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Bulk ingestion processed successfully");
        
        // Memastikan data yang dikembalikan sama persis panjangnya
        expect(response.body.data.length).toBe(payloadLenght);
    });

    it("berhasil mengembalikan error 400 (Bad Request) jika payload bukan array", async () => {
        // payload salah
        const invalidPayload = { "titile": "salah format" };

        const response = await request(app)
            .post("/internal/mentions/bulk")
            .send(invalidPayload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error.message).toBe("Payload must be an array of records");
    });
});