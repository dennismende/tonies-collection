import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TonieForm } from "@/components/tonie-form";
import type { Tonie } from "@/lib/schemas/tonie";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
    title: "Edit Tonie",
};

/**
 * Admin page for editing an existing Tonie figure.
 * Pre-populates the form with existing data.
 */
export default async function EditToniePage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tonies")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        notFound();
    }

    const tonie = data as Tonie;

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">
                Edit &quot;{tonie.name}&quot;
            </h1>
            <TonieForm tonie={tonie} />
        </div>
    );
}
