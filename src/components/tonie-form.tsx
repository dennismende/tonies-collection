"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createTonie, updateTonie } from "@/actions/tonie-actions";
import type { ActionResult } from "@/actions/tonie-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, X, Upload } from "lucide-react";
import { toast } from "sonner";
import type { Tonie } from "@/lib/schemas/tonie";

interface TonieFormProps {
    /** Existing tonie for edit mode. If undefined, the form is in create mode. */
    tonie?: Tonie;
    /** Pre-filled data from URL import (only in create mode). */
    prefill?: Partial<{
        name: string;
        series: string;
        imageUrl: string;
        trackList: string[];
        price: number;
        isCreativeTonie: boolean;
    }>;
}

/**
 * Shared form component for creating and editing Tonie figures.
 * Handles image upload, dynamic track list, and Zod validation via server actions.
 */
export function TonieForm({ tonie, prefill }: TonieFormProps) {
    const isEdit = !!tonie;
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [tracks, setTracks] = useState<string[]>(
        tonie?.track_list ?? prefill?.trackList ?? []
    );
    const [imagePreview, setImagePreview] = useState<string | null>(
        tonie?.image_url ?? prefill?.imageUrl ?? null
    );
    const [favorite, setFavorite] = useState(tonie?.favorite ?? false);
    const [isCreative, setIsCreative] = useState(
        tonie?.is_creative_tonie ?? prefill?.isCreativeTonie ?? false
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    const addTrack = () => setTracks([...tracks, ""]);
    const removeTrack = (index: number) =>
        setTracks(tracks.filter((_, i) => i !== index));
    const updateTrack = (index: number, value: string) => {
        const updated = [...tracks];
        updated[index] = value;
        setTracks(updated);
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setFieldErrors({});

        // Append structured data
        formData.set("favorite", String(favorite));
        formData.set("is_creative_tonie", String(isCreative));
        formData.set(
            "track_list",
            JSON.stringify(tracks.filter((t) => t.trim() !== ""))
        );

        // If we have a pre-filled image URL from import and no new upload
        const imageFile = formData.get("image") as File | null;
        if ((!imageFile || imageFile.size === 0) && prefill?.imageUrl) {
            formData.set("image_url", prefill.imageUrl);
        }

        if (isEdit) {
            formData.set("id", tonie!.id);
        }

        let result: ActionResult;
        try {
            result = isEdit
                ? await updateTonie(formData)
                : await createTonie(formData);
        } catch {
            // redirect() throws NEXT_REDIRECT — expected on success
            return;
        }

        setLoading(false);
        if (!result.success) {
            toast.error(result.error);
            if (result.fieldErrors) {
                setFieldErrors(result.fieldErrors);
            }
        }
    };

    return (
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-6 max-w-lg">
            {/* Name */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="e.g. The Lion King"
                    defaultValue={tonie?.name ?? prefill?.name ?? ""}
                    required
                    maxLength={200}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.name && (
                    <p id="name-error" className="text-sm text-destructive">
                        {fieldErrors.name[0]}
                    </p>
                )}
            </div>

            {/* Series */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="series">
                    Series <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="series"
                    name="series"
                    placeholder="e.g. Disney"
                    defaultValue={tonie?.series ?? prefill?.series ?? ""}
                    required
                    maxLength={100}
                    aria-describedby={fieldErrors.series ? "series-error" : undefined}
                />
                {fieldErrors.series && (
                    <p id="series-error" className="text-sm text-destructive">
                        {fieldErrors.series[0]}
                    </p>
                )}
            </div>

            {/* Image upload */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="image">Image</Label>
                {imagePreview && (
                    <div className="relative h-40 w-40 overflow-hidden rounded-lg bg-muted">
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="160px"
                        />
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <label
                        htmlFor="image"
                        className="flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm transition-colors hover:bg-accent"
                    >
                        <Upload className="h-4 w-4" />
                        {imagePreview ? "Replace image" : "Upload image"}
                    </label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    JPEG, PNG, or WebP. Max 5 MB.
                </p>
            </div>

            {/* Purchase date */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="purchase_date">Purchase date</Label>
                <Input
                    id="purchase_date"
                    name="purchase_date"
                    type="date"
                    defaultValue={tonie?.purchase_date ?? ""}
                />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="price">Price (EUR)</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    defaultValue={
                        tonie?.price?.toString() ?? prefill?.price?.toString() ?? ""
                    }
                />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any additional notes…"
                    defaultValue={tonie?.notes ?? ""}
                    maxLength={1000}
                    rows={3}
                />
            </div>

            {/* Favorite */}
            <div className="flex items-center gap-2">
                <Checkbox
                    id="favorite"
                    checked={favorite}
                    onCheckedChange={(checked) => setFavorite(checked === true)}
                />
                <Label htmlFor="favorite" className="cursor-pointer">
                    Mark as favorite
                </Label>
            </div>

            {/* Creative Tonie */}
            <div className="flex items-center gap-2">
                <Checkbox
                    id="is_creative_tonie"
                    checked={isCreative}
                    onCheckedChange={(checked) => setIsCreative(checked === true)}
                />
                <Label htmlFor="is_creative_tonie" className="cursor-pointer">
                    This is a Creative Tonie
                </Label>
            </div>

            {/* Track list */}
            <div className="flex flex-col gap-2">
                <Label>Track list</Label>
                <div className="flex flex-col gap-2">
                    {tracks.map((track, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="w-6 text-right text-xs text-muted-foreground">
                                {index + 1}.
                            </span>
                            <Input
                                value={track}
                                onChange={(e) => updateTrack(index, e.target.value)}
                                placeholder="Track name"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTrack(index)}
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove track</span>
                            </Button>
                        </div>
                    ))}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTrack}
                    className="w-fit gap-1"
                >
                    <Plus className="h-4 w-4" />
                    Add track
                </Button>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Save changes" : "Add Tonie"}
            </Button>
        </form>
    );
}
