import { describe, it, expect } from "vitest";
import {
    parseProductPage,
    parseNextData,
    parseJsonLd,
    parseOgTags,
} from "@/lib/import-parser";

// --- Fixture HTML fragments ---

const NEXT_DATA_HTML = `
<html>
<head></head>
<body>
<script id="__NEXT_DATA__" type="application/json">
{
  "props": {
    "pageProps": {
      "product": {
        "name": "The Lion King",
        "title": "The Lion King",
        "description": "A young lion prince flees his kingdom.",
        "categories": [{ "name": "Disney" }],
        "images": [{ "url": "https://cdn.tonies.com/lion-king.jpg" }],
        "price": { "amount": 14.99 },
        "tracks": [
          { "title": "Circle of Life" },
          { "title": "Hakuna Matata" }
        ],
        "isCreativeTonie": false
      }
    }
  }
}
</script>
</body>
</html>
`;

const JSON_LD_HTML = `
<html>
<head>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Peppa Pig",
  "description": "Join Peppa and her family.",
  "brand": { "name": "Peppa Pig" },
  "image": ["https://cdn.tonies.com/peppa.jpg"],
  "offers": {
    "@type": "Offer",
    "price": "16.99"
  }
}
</script>
</head>
<body></body>
</html>
`;

const OG_TAGS_HTML = `
<html>
<head>
<meta property="og:title" content="tonies® | Gruffalo" />
<meta property="og:image" content="https://cdn.tonies.com/gruffalo.jpg" />
<meta property="og:description" content="A mouse walks through the woods." />
</head>
<body></body>
</html>
`;

const EMPTY_HTML = `
<html><head></head><body><p>No product data here</p></body></html>
`;

// --- Tests ---

describe("parseNextData", () => {
    it("extracts product data from __NEXT_DATA__", () => {
        const result = parseNextData(NEXT_DATA_HTML);
        expect(result).not.toBeNull();
        expect(result?.name).toBe("The Lion King");
        expect(result?.series).toBe("Disney");
        expect(result?.imageUrl).toBe("https://cdn.tonies.com/lion-king.jpg");
        expect(result?.price).toBe(14.99);
        expect(result?.trackList).toEqual(["Circle of Life", "Hakuna Matata"]);
        expect(result?.isCreativeTonie).toBe(false);
    });

    it("returns null for HTML without __NEXT_DATA__", () => {
        expect(parseNextData(EMPTY_HTML)).toBeNull();
    });

    it("returns null for invalid JSON in __NEXT_DATA__", () => {
        const html = `<script id="__NEXT_DATA__" type="application/json">{invalid}</script>`;
        expect(parseNextData(html)).toBeNull();
    });
});

describe("parseJsonLd", () => {
    it("extracts product data from JSON-LD", () => {
        const result = parseJsonLd(JSON_LD_HTML);
        expect(result).not.toBeNull();
        expect(result?.name).toBe("Peppa Pig");
        expect(result?.series).toBe("Peppa Pig");
        expect(result?.imageUrl).toBe("https://cdn.tonies.com/peppa.jpg");
        expect(result?.price).toBe(16.99);
        expect(result?.description).toBe("Join Peppa and her family.");
    });

    it("returns null for HTML without JSON-LD", () => {
        expect(parseJsonLd(EMPTY_HTML)).toBeNull();
    });

    it("returns null for non-Product JSON-LD", () => {
        const html = `
      <script type="application/ld+json">
      {"@type": "Organization", "name": "Tonies"}
      </script>
    `;
        expect(parseJsonLd(html)).toBeNull();
    });
});

describe("parseOgTags", () => {
    it("extracts data from Open Graph meta tags", () => {
        const result = parseOgTags(OG_TAGS_HTML);
        expect(result).not.toBeNull();
        expect(result?.name).toBe("Gruffalo");
        expect(result?.imageUrl).toBe("https://cdn.tonies.com/gruffalo.jpg");
        expect(result?.description).toBe("A mouse walks through the woods.");
    });

    it("strips tonies® prefix from og:title", () => {
        const result = parseOgTags(OG_TAGS_HTML);
        expect(result?.name).not.toContain("tonies®");
    });

    it("returns null for HTML without OG tags", () => {
        expect(parseOgTags(EMPTY_HTML)).toBeNull();
    });
});

describe("parseProductPage (cascading)", () => {
    it("prefers __NEXT_DATA__ over other sources", () => {
        // Combine all sources
        const combined = NEXT_DATA_HTML.replace(
            "</head>",
            `<script type="application/ld+json">
       {"@type":"Product","name":"Wrong Name"}
       </script>
       <meta property="og:title" content="Also Wrong" />
       </head>`
        );
        const result = parseProductPage(combined);
        expect(result?.name).toBe("The Lion King");
    });

    it("falls back to JSON-LD when no __NEXT_DATA__", () => {
        const result = parseProductPage(JSON_LD_HTML);
        expect(result?.name).toBe("Peppa Pig");
    });

    it("falls back to OG tags when no other sources", () => {
        const result = parseProductPage(OG_TAGS_HTML);
        expect(result?.name).toBe("Gruffalo");
    });

    it("returns null when no data can be extracted", () => {
        expect(parseProductPage(EMPTY_HTML)).toBeNull();
    });

    it("merges track list from __NEXT_DATA__ with other fields", () => {
        const result = parseProductPage(NEXT_DATA_HTML);
        expect(result?.trackList).toEqual(["Circle of Life", "Hakuna Matata"]);
    });
});
