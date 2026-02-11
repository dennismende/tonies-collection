"use client";

import { useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
    value: "grid" | "list";
    onChange: (value: "grid" | "list") => void;
}

const STORAGE_KEY = "tonies-view-mode";

/**
 * Grid / list view toggle group.
 * Persists the user's view preference to localStorage.
 */
export function ViewToggle({ value, onChange }: ViewToggleProps) {
    // Load persisted preference on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as "grid" | "list" | null;
        if (stored && stored !== value) {
            onChange(stored);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist on change
    const handleChange = (newValue: string) => {
        if (newValue === "grid" || newValue === "list") {
            onChange(newValue);
            localStorage.setItem(STORAGE_KEY, newValue);
        }
    };

    return (
        <ToggleGroup
            type="single"
            value={value}
            onValueChange={handleChange}
            aria-label="View mode"
        >
            <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
                <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view" size="sm">
                <List className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
