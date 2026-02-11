import { describe, it, expect } from "vitest";
import {
    tonieSchema,
    createTonieSchema,
    updateTonieSchema,
    importUrlSchema,
} from "@/lib/schemas/tonie";

describe("tonieSchema", () => {
    const validTonie = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "The Lion King",
        series: "Disney",
        image_url: "https://example.com/image.jpg",
        purchase_date: "2024-01-15",
        price: 14.99,
        notes: "A classic Disney story",
        favorite: true,
        track_list: ["Circle of Life", "Hakuna Matata"],
        is_creative_tonie: false,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
    };

    it("accepts a valid tonie object", () => {
        const result = tonieSchema.safeParse(validTonie);
        expect(result.success).toBe(true);
    });

    it("accepts nullable fields as null", () => {
        const result = tonieSchema.safeParse({
            ...validTonie,
            image_url: null,
            purchase_date: null,
            price: null,
            notes: null,
            track_list: null,
        });
        expect(result.success).toBe(true);
    });

    it("rejects missing required fields", () => {
        const result = tonieSchema.safeParse({ id: validTonie.id });
        expect(result.success).toBe(false);
    });

    it("rejects invalid UUID", () => {
        const result = tonieSchema.safeParse({
            ...validTonie,
            id: "not-a-uuid",
        });
        expect(result.success).toBe(false);
    });

    it("rejects empty name", () => {
        const result = tonieSchema.safeParse({ ...validTonie, name: "" });
        expect(result.success).toBe(false);
    });

    it("rejects negative price", () => {
        const result = tonieSchema.safeParse({ ...validTonie, price: -5 });
        expect(result.success).toBe(false);
    });

    it("rejects notes exceeding max length", () => {
        const result = tonieSchema.safeParse({
            ...validTonie,
            notes: "x".repeat(1001),
        });
        expect(result.success).toBe(false);
    });
});

describe("createTonieSchema", () => {
    it("accepts minimal required fields", () => {
        const result = createTonieSchema.safeParse({
            name: "Peppa Pig",
            series: "Peppa Pig",
        });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.favorite).toBe(false);
            expect(result.data.is_creative_tonie).toBe(false);
        }
    });

    it("accepts all optional fields", () => {
        const result = createTonieSchema.safeParse({
            name: "Peppa Pig",
            series: "Peppa Pig",
            image_url: "https://example.com/peppa.jpg",
            purchase_date: "2024-06-01",
            price: "16.99",
            notes: "Birthday gift",
            favorite: true,
            track_list: ["Episode 1", "Episode 2"],
            is_creative_tonie: false,
        });
        expect(result.success).toBe(true);
    });

    it("coerces string price to number", () => {
        const result = createTonieSchema.safeParse({
            name: "Test",
            series: "Test",
            price: "14.99",
        });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.price).toBe(14.99);
        }
    });

    it("rejects empty name", () => {
        const result = createTonieSchema.safeParse({
            name: "",
            series: "Disney",
        });
        expect(result.success).toBe(false);
    });

    it("rejects empty series", () => {
        const result = createTonieSchema.safeParse({
            name: "Test",
            series: "",
        });
        expect(result.success).toBe(false);
    });

    it("rejects name exceeding max length", () => {
        const result = createTonieSchema.safeParse({
            name: "x".repeat(201),
            series: "Test",
        });
        expect(result.success).toBe(false);
    });
});

describe("updateTonieSchema", () => {
    it("requires an id", () => {
        const result = updateTonieSchema.safeParse({
            name: "Updated Name",
        });
        expect(result.success).toBe(false);
    });

    it("accepts id with partial updates", () => {
        const result = updateTonieSchema.safeParse({
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "Updated Name",
        });
        expect(result.success).toBe(true);
    });

    it("accepts id with no other fields", () => {
        const result = updateTonieSchema.safeParse({
            id: "550e8400-e29b-41d4-a716-446655440000",
        });
        expect(result.success).toBe(true);
    });
});

describe("importUrlSchema", () => {
    it("accepts a valid tonies.com URL", () => {
        const result = importUrlSchema.safeParse(
            "https://tonies.com/en-gb/tonies/peppa-pig"
        );
        expect(result.success).toBe(true);
    });

    it("accepts subdomain tonies.com URLs", () => {
        const result = importUrlSchema.safeParse(
            "https://www.tonies.com/en-us/tonies/lion-king"
        );
        expect(result.success).toBe(true);
    });

    it("rejects non-tonies.com URLs", () => {
        const result = importUrlSchema.safeParse("https://evil.com/tonies/fake");
        expect(result.success).toBe(false);
    });

    it("rejects non-URL strings", () => {
        const result = importUrlSchema.safeParse("not-a-url");
        expect(result.success).toBe(false);
    });

    it("rejects empty string", () => {
        const result = importUrlSchema.safeParse("");
        expect(result.success).toBe(false);
    });

    it("rejects URLs with tonies.com as subdomain of another domain", () => {
        const result = importUrlSchema.safeParse(
            "https://tonies.com.evil.com/product"
        );
        expect(result.success).toBe(false);
    });
});
