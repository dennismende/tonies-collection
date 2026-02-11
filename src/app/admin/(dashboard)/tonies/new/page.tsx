import { TonieForm } from "@/components/tonie-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Add New Tonie",
};

/**
 * Admin page for adding a new Tonie figure manually.
 */
export default function NewToniePage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Add New Tonie</h1>
            <TonieForm />
        </div>
    );
}
