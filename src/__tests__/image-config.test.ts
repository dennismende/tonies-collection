import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Tests that next.config.ts has the correct image hostname patterns configured.
 * This prevents runtime errors from `next/image` when loading external images.
 */
describe("next.config.ts image remote patterns", () => {
    const configPath = path.resolve(__dirname, "../../next.config.ts");
    const configContent = fs.readFileSync(configPath, "utf-8");

    it("allows Supabase storage hostnames", () => {
        // Must allow *.supabase.co for any Supabase project
        expect(configContent).toContain("**.supabase.co");
    });

    it("allows tonies.com hostnames", () => {
        // Must allow tonies.com and subdomains for imported images
        expect(configContent).toContain("**.tonies.com");
        expect(configContent).toContain('"tonies.com"');
    });

    it("uses HTTPS protocol for all patterns", () => {
        // All remote patterns must use HTTPS
        const httpMatches = configContent.match(/protocol:\s*"http[^s]/g);
        expect(httpMatches).toBeNull();
    });

    it("has remotePatterns configured under images", () => {
        expect(configContent).toContain("images:");
        expect(configContent).toContain("remotePatterns:");
    });
});

/**
 * Validates that a real Supabase storage URL would match the configured pattern.
 * This simulates the logic Next.js uses to check remote patterns.
 */
describe("hostname pattern matching", () => {
    /** Simple glob matcher for **.domain.tld patterns */
    function matchesPattern(hostname: string, pattern: string): boolean {
        if (pattern.startsWith("**.")) {
            const suffix = pattern.slice(2); // ".supabase.co"
            return hostname.endsWith(suffix) || hostname === suffix.slice(1);
        }
        return hostname === pattern;
    }

    it("matches any Supabase project hostname", () => {
        expect(
            matchesPattern("tzifdwhgamranqkwgjvs.supabase.co", "**.supabase.co")
        ).toBe(true);
        expect(
            matchesPattern("abcdef123456.supabase.co", "**.supabase.co")
        ).toBe(true);
    });

    it("matches tonies.com subdomains", () => {
        expect(matchesPattern("cdn.tonies.com", "**.tonies.com")).toBe(true);
        expect(matchesPattern("www.tonies.com", "**.tonies.com")).toBe(true);
        expect(matchesPattern("images.tonies.com", "**.tonies.com")).toBe(true);
    });

    it("matches bare tonies.com", () => {
        expect(matchesPattern("tonies.com", "tonies.com")).toBe(true);
    });

    it("does not match unrelated hostnames", () => {
        expect(matchesPattern("evil.com", "**.supabase.co")).toBe(false);
        expect(matchesPattern("supabase.co.evil.com", "**.supabase.co")).toBe(
            false
        );
        expect(matchesPattern("not-tonies.com", "tonies.com")).toBe(false);
    });
});
