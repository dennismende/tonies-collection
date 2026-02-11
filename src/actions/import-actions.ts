"use server";

import { createClient } from "@/lib/supabase/server";
import { importUrlSchema, type ImportResult } from "@/lib/schemas/tonie";
import { parseProductPage } from "@/lib/import-parser";

/** Result type for the import action. */
export type ImportActionResult =
    | { success: true; data: ImportResult; duplicateWarning?: string }
    | { success: false; error: string };

/**
 * Server Action: fetches a tonies.com product page, parses the HTML,
 * extracts product data, downloads the image, and returns it for
 * pre-filling the create form.
 */
export async function importFromUrl(url: string): Promise<ImportActionResult> {
    const supabase = await createClient();

    // Auth check
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Validate URL
    const urlResult = importUrlSchema.safeParse(url);
    if (!urlResult.success) {
        return {
            success: false,
            error: urlResult.error.issues[0]?.message ?? "Invalid URL",
        };
    }

    // Fetch the page HTML (server-side, no CORS issues)
    let html: string;
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (compatible; ToniesCollectionBot/1.0)",
                Accept: "text/html",
            },
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            return {
                success: false,
                error: `Failed to fetch page (HTTP ${response.status})`,
            };
        }

        html = await response.text();
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Network error";
        return {
            success: false,
            error: `Failed to fetch the page: ${message}`,
        };
    }

    // Parse product data
    const parsed = parseProductPage(html);
    if (!parsed || !parsed.name) {
        return {
            success: false,
            error: "Could not extract product data from this URL.",
        };
    }

    // Download image
    let imageBuffer: Buffer | null = null;
    let imageUrl: string | null = parsed.imageUrl;

    if (parsed.imageUrl) {
        try {
            const imgResponse = await fetch(parsed.imageUrl, {
                signal: AbortSignal.timeout(10000),
            });
            if (imgResponse.ok) {
                const arrayBuffer = await imgResponse.arrayBuffer();
                imageBuffer = Buffer.from(arrayBuffer);

                // Upload to Supabase Storage
                const ext = parsed.imageUrl.split(".").pop()?.split("?")[0] ?? "jpg";
                const fileName = `${crypto.randomUUID()}.${ext}`;

                const { error: uploadError } = await supabase.storage
                    .from("tonies-images")
                    .upload(fileName, imageBuffer, {
                        contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
                        upsert: false,
                    });

                if (!uploadError) {
                    const {
                        data: { publicUrl },
                    } = supabase.storage.from("tonies-images").getPublicUrl(fileName);
                    imageUrl = publicUrl;
                }
            }
        } catch {
            // Image download failed — continue without image
            imageUrl = null;
        }
    }

    // Check for duplicates
    let duplicateWarning: string | undefined;
    if (parsed.name) {
        const { data: existing } = await supabase
            .from("tonies")
            .select("id")
            .ilike("name", parsed.name)
            .limit(1);

        if (existing && existing.length > 0) {
            duplicateWarning = `A figure with the name "${parsed.name}" already exists.`;
        }
    }

    return {
        success: true,
        data: {
            name: parsed.name,
            series: parsed.series,
            imageUrl,
            imageBuffer: null, // Don't send buffer to client
            trackList: parsed.trackList,
            price: parsed.price,
            description: parsed.description,
            isCreativeTonie: parsed.isCreativeTonie,
        },
        duplicateWarning,
    };
}
