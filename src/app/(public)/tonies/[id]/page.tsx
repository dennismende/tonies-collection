import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TonieDetail } from "@/components/tonie-detail";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tonie } from "@/lib/schemas/tonie";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * Fetches a single Tonie figure by ID.
 */
async function getTonie(id: string): Promise<Tonie | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tonies")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) return null;
    return data as Tonie;
}

/**
 * Generate dynamic metadata (title + OG tags) per figure.
 */
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id } = await params;
    const tonie = await getTonie(id);

    if (!tonie) {
        return { title: "Not Found" };
    }

    return {
        title: tonie.name,
        description: `${tonie.name} — ${tonie.series} Tonie figure in our collection.`,
        openGraph: {
            title: `${tonie.name} | Tonies Collection`,
            description: `${tonie.name} — ${tonie.series} Tonie figure.`,
            ...(tonie.image_url && { images: [{ url: tonie.image_url }] }),
        },
    };
}

function DetailSkeleton() {
    return (
        <div className="flex flex-col gap-8">
            <Skeleton className="h-6 w-40" />
            <div className="grid gap-8 md:grid-cols-2">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        </div>
    );
}

async function DetailContent({ id }: { id: string }) {
    const tonie = await getTonie(id);
    if (!tonie) notFound();
    return <TonieDetail tonie={tonie} />;
}

/**
 * Detail page for a single Tonie figure.
 * Server-rendered with dynamic OG tags for each figure.
 */
export default async function TonieDetailPage({ params }: PageProps) {
    const { id } = await params;

    return (
        <Suspense fallback={<DetailSkeleton />}>
            <DetailContent id={id} />
        </Suspense>
    );
}
