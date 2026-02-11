"use client";

import { useState } from "react";
import { importFromUrl } from "@/actions/import-actions";
import type { ImportResult } from "@/lib/schemas/tonie";
import { TonieForm } from "@/components/tonie-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Import } from "lucide-react";
import { toast } from "sonner";

/**
 * Admin page for importing a Tonie figure from a tonies.com URL.
 * Fetches product data, shows a preview, and pre-fills the create form.
 */
export default function ImportPage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [importData, setImportData] = useState<ImportResult | null>(null);
    const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setImportData(null);
        setDuplicateWarning(null);

        const result = await importFromUrl(url);

        setLoading(false);
        if (result.success) {
            setImportData(result.data);
            if (result.duplicateWarning) {
                setDuplicateWarning(result.duplicateWarning);
            }
            toast.success("Product data fetched successfully!");
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Import from URL</h1>

            {/* URL input form */}
            <form onSubmit={handleFetch} className="flex flex-col gap-4 max-w-lg">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="import-url">Tonies.com product URL</Label>
                    <div className="flex gap-2">
                        <Input
                            id="import-url"
                            type="url"
                            placeholder="https://tonies.com/en-gb/tonies/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                        <Button type="submit" disabled={loading} className="gap-1.5">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Import className="h-4 w-4" />
                            )}
                            Fetch
                        </Button>
                    </div>
                </div>
            </form>

            {/* Duplicate warning */}
            {duplicateWarning && (
                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                    ⚠️ {duplicateWarning}
                </div>
            )}

            {/* Pre-filled form */}
            {importData && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">Review imported data</h2>
                    <p className="text-sm text-muted-foreground">
                        Review and edit the data below before saving.
                    </p>
                    <TonieForm
                        prefill={{
                            name: importData.name,
                            series: importData.series ?? undefined,
                            imageUrl: importData.imageUrl ?? undefined,
                            trackList: importData.trackList ?? undefined,
                            price: importData.price ?? undefined,
                            isCreativeTonie: importData.isCreativeTonie,
                        }}
                    />
                </div>
            )}
        </div>
    );
}
