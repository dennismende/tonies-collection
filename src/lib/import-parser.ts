/**
 * Parses structured product data from a tonies.com product page HTML.
 * Attempts extraction from three sources in priority order:
 * 1. __NEXT_DATA__ (most comprehensive)
 * 2. JSON-LD (Schema.org Product)
 * 3. Open Graph meta tags (fallback)
 */

export interface ParsedProduct {
    name: string | null;
    series: string | null;
    imageUrl: string | null;
    trackList: string[] | null;
    price: number | null;
    description: string | null;
    isCreativeTonie: boolean;
}

/**
 * Main extraction function. Tries all sources and merges results.
 */
export function parseProductPage(html: string): ParsedProduct | null {
    const nextData = parseNextData(html);
    const jsonLd = parseJsonLd(html);
    const og = parseOgTags(html);

    // If no sources produced a name, we have no usable data
    const name = nextData?.name ?? jsonLd?.name ?? og?.name;
    if (!name) return null;

    return {
        name,
        series: nextData?.series ?? jsonLd?.series ?? og?.series ?? null,
        imageUrl: nextData?.imageUrl ?? jsonLd?.imageUrl ?? og?.imageUrl ?? null,
        trackList: nextData?.trackList ?? null,
        price: nextData?.price ?? jsonLd?.price ?? null,
        description:
            nextData?.description ?? jsonLd?.description ?? og?.description ?? null,
        isCreativeTonie: nextData?.isCreativeTonie ?? false,
    };
}

/**
 * Extract product data from __NEXT_DATA__ script tag.
 * This contains the most comprehensive data model.
 */
export function parseNextData(html: string): ParsedProduct | null {
    try {
        const match = html.match(
            /<script\s+id="__NEXT_DATA__"\s+type="application\/json"[^>]*>([\s\S]*?)<\/script>/
        );
        if (!match?.[1]) return null;

        const nextData = JSON.parse(match[1]);

        // Navigate the data structure — tonies.com uses various nested paths
        const pageProps = nextData?.props?.pageProps;
        if (!pageProps) return null;

        // Try to find product data (the exact path may vary by page type)
        const product =
            pageProps.product ??
            pageProps.data?.product ??
            pageProps.initialData?.product;

        if (!product) return null;

        // Extract categories/series
        const categories = product.categories ?? product.category ?? [];
        const series = Array.isArray(categories)
            ? categories[0]?.name ?? categories[0] ?? null
            : typeof categories === "string"
                ? categories
                : null;

        // Extract tracks
        const tracks = product.tracks ?? product.chapters ?? product.trackList;
        const trackList = Array.isArray(tracks)
            ? tracks.map(
                (t: { title?: string; name?: string }) => t.title ?? t.name ?? String(t)
            )
            : null;

        // Detect Creative Tonie
        const isCreativeTonie =
            product.isCreativeTonie ??
            (typeof series === "string" &&
                series.toLowerCase().includes("creative")) ??
            false;

        // Extract image
        const images = product.images ?? product.media ?? [];
        const imageUrl = Array.isArray(images)
            ? images[0]?.url ?? images[0]?.src ?? images[0] ?? null
            : product.image ?? null;

        // Extract price
        const priceObj = product.price ?? product.pricing;
        const price =
            typeof priceObj === "number"
                ? priceObj
                : typeof priceObj?.amount === "number"
                    ? priceObj.amount
                    : typeof priceObj?.value === "number"
                        ? priceObj.value
                        : null;

        return {
            name: product.name ?? product.title ?? null,
            series,
            imageUrl: typeof imageUrl === "string" ? imageUrl : null,
            trackList,
            price,
            description: product.description ?? null,
            isCreativeTonie,
        };
    } catch {
        return null;
    }
}

/**
 * Extract product data from JSON-LD structured data.
 */
export function parseJsonLd(html: string): ParsedProduct | null {
    try {
        const regex =
            /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
        let match;

        while ((match = regex.exec(html)) !== null) {
            const data = JSON.parse(match[1]);

            // Handle both single objects and arrays
            const items = Array.isArray(data) ? data : [data];

            for (const item of items) {
                if (item["@type"] === "Product") {
                    const price = item.offers?.price
                        ? parseFloat(item.offers.price)
                        : null;

                    return {
                        name: item.name ?? null,
                        series: item.brand?.name ?? null,
                        imageUrl: Array.isArray(item.image)
                            ? item.image[0]
                            : item.image ?? null,
                        trackList: null,
                        price,
                        description: item.description ?? null,
                        isCreativeTonie: false,
                    };
                }
            }
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Extract product data from Open Graph meta tags.
 */
export function parseOgTags(html: string): ParsedProduct | null {
    try {
        const getOgContent = (property: string): string | null => {
            const match = html.match(
                new RegExp(
                    `<meta\\s+(?:property|name)="${property}"\\s+content="([^"]*)"`,
                    "i"
                )
            );
            return match?.[1] ?? null;
        };

        const title = getOgContent("og:title");
        if (!title) return null;

        // Clean up title (often contains "tonies® | " prefix)
        const cleanName = title
            .replace(/tonies®?\s*[|I]\s*/gi, "")
            .replace(/\s*[|I]\s*Buy.*$/i, "")
            .trim();

        return {
            name: cleanName || title,
            series: null,
            imageUrl: getOgContent("og:image"),
            trackList: null,
            price: null,
            description: getOgContent("og:description"),
            isCreativeTonie: false,
        };
    } catch {
        return null;
    }
}
