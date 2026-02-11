"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TonieCard } from "@/components/tonie-card";
import { TonieRow } from "@/components/tonie-row";
import { FilterBar } from "@/components/filter-bar";
import { SortSelect, type SortOption } from "@/components/sort-select";
import { ViewToggle } from "@/components/view-toggle";
import { EmptyState } from "@/components/empty-state";
import type { Tonie } from "@/lib/schemas/tonie";

/**
 * Client component that orchestrates the full catalog page:
 * search, filter, sort, and grid/list view toggle.
 *
 * @param tonies - All Tonie figures fetched server-side.
 */
export function CatalogPage({ tonies }: { tonies: Tonie[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // --- URL state ---
    const query = searchParams.get("q") ?? "";
    const selectedSeries = searchParams.getAll("series");
    const favoritesOnly = searchParams.get("fav") === "1";
    const sortKey = (searchParams.get("sort") ?? "name") as SortOption["field"];
    const sortDir = (searchParams.get("dir") ?? "asc") as "asc" | "desc";

    // --- View state (localStorage-persisted via ViewToggle) ---
    const [view, setView] = useState<"grid" | "list">("grid");

    /** Update URL search params without full page reload. */
    const updateParams = useCallback(
        (updates: Record<string, string | string[] | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                params.delete(key);
                if (value === null) return;
                if (Array.isArray(value)) {
                    value.forEach((v) => params.append(key, v));
                } else {
                    params.set(key, value);
                }
            });

            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [searchParams, router, pathname]
    );

    // --- Distinct series for filter dropdown ---
    const allSeries = useMemo(() => {
        const set = new Set(tonies.map((t) => t.series));
        return Array.from(set).sort();
    }, [tonies]);

    // --- Filter ---
    const filtered = useMemo(() => {
        return tonies.filter((t) => {
            // Text search
            if (query) {
                const q = query.toLowerCase();
                const matches =
                    t.name.toLowerCase().includes(q) ||
                    t.series.toLowerCase().includes(q) ||
                    (t.notes?.toLowerCase().includes(q) ?? false);
                if (!matches) return false;
            }
            // Series filter
            if (selectedSeries.length > 0 && !selectedSeries.includes(t.series)) {
                return false;
            }
            // Favorites filter
            if (favoritesOnly && !t.favorite) {
                return false;
            }
            return true;
        });
    }, [tonies, query, selectedSeries, favoritesOnly]);

    // --- Sort ---
    const sorted = useMemo(() => {
        const compare = (a: Tonie, b: Tonie): number => {
            let aVal: string | number | null;
            let bVal: string | number | null;

            switch (sortKey) {
                case "name":
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                    break;
                case "purchaseDate":
                    aVal = a.purchase_date;
                    bVal = b.purchase_date;
                    break;
                case "price":
                    aVal = a.price;
                    bVal = b.price;
                    break;
                default:
                    return 0;
            }

            // Nulls last
            if (aVal === null && bVal === null) return 0;
            if (aVal === null) return 1;
            if (bVal === null) return -1;

            if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
            return 0;
        };

        return [...filtered].sort(compare);
    }, [filtered, sortKey, sortDir]);

    const hasActiveFilters = !!(query || selectedSeries.length > 0 || favoritesOnly);

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Tonies Collection
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {hasActiveFilters
                            ? `Showing ${sorted.length} of ${tonies.length} tonies`
                            : `${tonies.length} tonies`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <SortSelect
                        value={`${sortKey}-${sortDir}`}
                        onChange={(field, dir) =>
                            updateParams({ sort: field, dir })
                        }
                    />
                    <ViewToggle value={view} onChange={setView} />
                </div>
            </div>

            {/* Filters */}
            <FilterBar
                query={query}
                onQueryChange={(q) => updateParams({ q: q || null })}
                allSeries={allSeries}
                selectedSeries={selectedSeries}
                onSeriesChange={(s) =>
                    updateParams({ series: s.length > 0 ? s : null })
                }
                favoritesOnly={favoritesOnly}
                onFavoritesChange={(f) => updateParams({ fav: f ? "1" : null })}
                onClear={() => updateParams({ q: null, series: null, fav: null })}
                hasActiveFilters={hasActiveFilters}
            />

            {/* Content */}
            {sorted.length === 0 ? (
                <EmptyState
                    type={hasActiveFilters ? "no-results" : "empty"}
                    onClear={
                        hasActiveFilters
                            ? () => updateParams({ q: null, series: null, fav: null })
                            : undefined
                    }
                />
            ) : view === "grid" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {sorted.map((tonie) => (
                        <TonieCard key={tonie.id} tonie={tonie} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {sorted.map((tonie) => (
                        <TonieRow key={tonie.id} tonie={tonie} />
                    ))}
                </div>
            )}
        </div>
    );
}
