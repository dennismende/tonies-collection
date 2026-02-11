"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { Search, Star, X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    allSeries: string[];
    selectedSeries: string[];
    onSeriesChange: (series: string[]) => void;
    favoritesOnly: boolean;
    onFavoritesChange: (value: boolean) => void;
    onClear: () => void;
    hasActiveFilters: boolean;
}

/**
 * Filter bar with search input, series multi-select (combobox), and favorites toggle.
 * All filter state is managed by the parent CatalogPage via URL search params.
 */
export function FilterBar({
    query,
    onQueryChange,
    allSeries,
    selectedSeries,
    onSeriesChange,
    favoritesOnly,
    onFavoritesChange,
    onClear,
    hasActiveFilters,
}: FilterBarProps) {
    const [localQuery, setLocalQuery] = useState(query);
    const [seriesOpen, setSeriesOpen] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            onQueryChange(localQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [localQuery, onQueryChange]);

    // Sync external query changes (e.g. clear filters)
    useEffect(() => {
        setLocalQuery(query);
    }, [query]);

    const toggleSeries = useCallback(
        (series: string) => {
            if (selectedSeries.includes(series)) {
                onSeriesChange(selectedSeries.filter((s) => s !== series));
            } else {
                onSeriesChange([...selectedSeries, series]);
            }
        },
        [selectedSeries, onSeriesChange]
    );

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        role="searchbox"
                        aria-label="Search tonies"
                        placeholder="Search tonies…"
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Series multi-select combobox */}
                <Popover open={seriesOpen} onOpenChange={setSeriesOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={seriesOpen}
                            className="w-full justify-between sm:w-48"
                        >
                            {selectedSeries.length > 0
                                ? `${selectedSeries.length} series`
                                : "All series"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search series…" />
                            <CommandList>
                                <CommandEmpty>No series found.</CommandEmpty>
                                <CommandGroup>
                                    {allSeries.map((series) => (
                                        <CommandItem
                                            key={series}
                                            value={series}
                                            onSelect={() => toggleSeries(series)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedSeries.includes(series)
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {series}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* Favorites toggle */}
                <Toggle
                    variant="outline"
                    aria-label="Filter favorites only"
                    pressed={favoritesOnly}
                    onPressedChange={onFavoritesChange}
                    className="gap-1.5"
                >
                    <Star className="h-4 w-4" />
                    <span className="hidden sm:inline">Favorites</span>
                </Toggle>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={onClear} className="gap-1">
                        <X className="h-4 w-4" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Active filter badges */}
            {selectedSeries.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selectedSeries.map((series) => (
                        <Badge
                            key={series}
                            variant="secondary"
                            className="cursor-pointer gap-1 pr-1"
                            onClick={() => toggleSeries(series)}
                        >
                            {series}
                            <X className="h-3 w-3" />
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
