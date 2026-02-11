import { z } from "zod";

/**
 * Zod schema for a Tonie figure as stored in the database.
 * Used for validating data read from Supabase.
 */
export const tonieSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(200),
    series: z.string().min(1).max(100),
    image_url: z.string().nullable(),
    purchase_date: z.string().nullable(),
    price: z.number().min(0).nullable(),
    notes: z.string().max(1000).nullable(),
    favorite: z.boolean(),
    track_list: z.array(z.string()).nullable(),
    is_creative_tonie: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});

/**
 * Zod schema for creating a new Tonie figure.
 * Omits auto-generated fields (id, created_at, updated_at).
 */
export const createTonieSchema = z.object({
    name: z.string().min(1, "Name is required").max(200),
    series: z.string().min(1, "Series is required").max(100),
    image_url: z.string().nullable().optional(),
    purchase_date: z.string().nullable().optional(),
    price: z.coerce.number().min(0).nullable().optional(),
    notes: z.string().max(1000).nullable().optional(),
    favorite: z.boolean().optional().default(false),
    track_list: z.array(z.string()).nullable().optional(),
    is_creative_tonie: z.boolean().optional().default(false),
});

/**
 * Zod schema for updating an existing Tonie figure.
 * All fields are optional — only provided fields are updated.
 */
export const updateTonieSchema = createTonieSchema.partial().extend({
    id: z.string().uuid(),
});

/** Inferred TypeScript type for a Tonie figure from the database. */
export type Tonie = z.infer<typeof tonieSchema>;

/** Inferred TypeScript type for creating a Tonie figure. */
export type CreateTonie = z.infer<typeof createTonieSchema>;

/** Inferred TypeScript type for updating a Tonie figure. */
export type UpdateTonie = z.infer<typeof updateTonieSchema>;

/**
 * Zod schema for validating a tonies.com import URL.
 * Only allows URLs from the tonies.com domain to prevent SSRF.
 */
export const importUrlSchema = z
    .string()
    .url("Please enter a valid URL")
    .refine(
        (url) => {
            try {
                const parsed = new URL(url);
                return parsed.hostname.endsWith("tonies.com");
            } catch {
                return false;
            }
        },
        { message: "URL must be from tonies.com" }
    );

/**
 * Type for the result of importing data from a tonies.com URL.
 */
export type ImportResult = {
    name: string;
    series: string | null;
    imageUrl: string | null;
    imageBuffer: Buffer | null;
    trackList: string[] | null;
    price: number | null;
    description: string | null;
    isCreativeTonie: boolean;
};
