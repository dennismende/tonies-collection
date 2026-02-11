import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { CatalogPage } from "@/components/catalog-page";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tonie } from "@/lib/schemas/tonie";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Collection",
    description:
        "Browse our family's collection of Tonie box figures — audio stories and songs for kids.",
};

/**
 * Fetches all Tonie figures from Supabase.
 * Uses the server client — no data exposed to the client bundle.
 */
async function getTonies(): Promise<Tonie[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tonies")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Failed to fetch tonies:", error);
        return [];
    }

    return (data ?? []) as Tonie[];
}

function CatalogSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-9 w-32" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}

async function CatalogContent() {
    const tonies = await getTonies();
    return <CatalogPage tonies={tonies} />;
}

/**
 * Public home page — Server Component that fetches all tonies
 * and renders the catalog with search, filter, sort, and view toggle.
 */
export default function HomePage() {
    return (
        <Suspense fallback={<CatalogSkeleton />}>
            <CatalogContent />
        </Suspense>
    );
}
