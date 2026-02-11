"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface SortOption {
    label: string;
    field: "name" | "purchaseDate" | "price";
    dir: "asc" | "desc";
    value: string;
}

const SORT_OPTIONS: SortOption[] = [
    { label: "Name (A → Z)", field: "name", dir: "asc", value: "name-asc" },
    { label: "Name (Z → A)", field: "name", dir: "desc", value: "name-desc" },
    {
        label: "Newest first",
        field: "purchaseDate",
        dir: "desc",
        value: "purchaseDate-desc",
    },
    {
        label: "Oldest first",
        field: "purchaseDate",
        dir: "asc",
        value: "purchaseDate-asc",
    },
    {
        label: "Price (low → high)",
        field: "price",
        dir: "asc",
        value: "price-asc",
    },
    {
        label: "Price (high → low)",
        field: "price",
        dir: "desc",
        value: "price-desc",
    },
];

interface SortSelectProps {
    value: string;
    onChange: (field: SortOption["field"], dir: "asc" | "desc") => void;
}

/**
 * Sort dropdown with 6 options (name, purchase date, price × asc/desc).
 * Delegates the actual sort logic to the parent CatalogPage.
 */
export function SortSelect({ value, onChange }: SortSelectProps) {
    return (
        <Select
            value={value}
            onValueChange={(v) => {
                const option = SORT_OPTIONS.find((o) => o.value === v);
                if (option) onChange(option.field, option.dir);
            }}
        >
            <SelectTrigger className="w-44" aria-label="Sort by">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
